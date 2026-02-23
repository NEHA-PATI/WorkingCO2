const repo = require('./reward.repository');
const { MONTHLY_CAP } = require('../../config/constants');

const HOURS_24_MS = 24 * 60 * 60 * 1000;
const DAILY_CHECKIN_KEY = 'daily_checkin';
const DAILY_QUIZ_KEY = 'daily_quiz';

const toSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toPositiveNullableNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const isMissingTableError = (error) => error?.code === '42P01';

const getTaskSummaryFromCompletions = (completionRows, taskType) => {
  const matching = completionRows.filter((row) => row.action_key === taskType);

  const completionCount = matching.reduce((sum, row) => {
    return sum + toSafeNumber(row.completion_count, 0);
  }, 0);

  const lastTimestampMs = matching.reduce((latest, row) => {
    const current = row.last_completed_at
      ? new Date(row.last_completed_at).getTime()
      : 0;
    return current > latest ? current : latest;
  }, 0);

  return {
    completionCount,
    lastCompletedAt: lastTimestampMs > 0
      ? new Date(lastTimestampMs).toISOString()
      : null
  };
};

/* ===============================
   GROUPED RULES FOR FRONTEND
================================ */
const getGroupedRules = async () => {
  const rules = await repo.getAllActiveRules();
  const grouped = {};

  rules.forEach((rule) => {
    const {
      rule_id,
      action_key,
      action_type,
      points,
      milestone_weeks,
      max_points_per_day,
      required_score,
      is_active,
      rules: ruleList   // 👈 get rules from DB
    } = rule;

    if (!grouped[action_key]) {
      grouped[action_key] = {
        is_active,
        rule_id
      };
    }

    if (action_type === 'consistency') {
      if (!grouped[action_key].consistency) {
        grouped[action_key].consistency = {};
      }

      grouped[action_key].consistency[milestone_weeks] = {
        rule_id,
        points: toSafeNumber(points, 0),
        is_active,
        rules: ruleList || []   // 👈 added
      };

      return;
    }

    if (action_type === 'daily') {
      grouped[action_key].daily = {
        rule_id,
        points_per_action: toSafeNumber(points, 0),
        max_per_day: toNullableNumber(max_points_per_day),
        required_score: toPositiveNullableNumber(required_score),
        is_active,
        rules: ruleList || []   // 👈 added
      };

      return;
    }

    // one_time or other types
    grouped[action_key][action_type] = {
      rule_id,
      points: toSafeNumber(points, 0),
      is_active,
      rules: ruleList || []   // 👈 added
    };
  });

  return grouped;
};



const getTaskDefinitions = async () => {
  const groupedRules = await getGroupedRules();
  const tasks = [];

  Object.entries(groupedRules).forEach(([actionKey, config]) => {

    // ONE TIME TASK
    if (config.one_time?.points !== undefined) {
      tasks.push({
        task_type: actionKey,
        action_type: 'one_time',
        points: toSafeNumber(config.one_time.points, 0),
        required_score: null,
        repeatable: false,

        // ✅ ADD THIS
        rules: config.one_time.rules || []
      });
    }

    // DAILY TASK
    if (config.daily?.points_per_action !== undefined) {
      tasks.push({
        task_type: actionKey,
        action_type: 'daily',
        points: toSafeNumber(config.daily.points_per_action, 0),
        required_score: toPositiveNullableNumber(config.daily.required_score),
        repeatable: true,

        // ✅ ADD THIS
        rules: config.daily.rules || []
      });
    }

  });

  return tasks.sort((a, b) => {
    if (a.action_type !== b.action_type) {
      return a.action_type.localeCompare(b.action_type);
    }
    return a.task_type.localeCompare(b.task_type);
  });
};


const getTaskDefinitionByType = async (taskType) => {
  const taskDefinitions = await getTaskDefinitions();
  return taskDefinitions.find((task) => task.task_type === taskType) || null;
};

/* ===============================
   ONE TIME
================================ */
const awardOneTime = async (u_id, action_key) => {
  const rule = await repo.getRule(action_key, 'one_time');
  if (!rule) {
    return { awarded: false, reason: 'RULE_NOT_FOUND' };
  }

  const alreadyCompleted = await repo.hasEventEver(
    u_id,
    action_key,
    'one_time'
  );
  if (alreadyCompleted) {
    return { awarded: false, reason: 'ALREADY_COMPLETED' };
  }

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) {
    return { awarded: false, reason: 'MONTHLY_CAP_REACHED' };
  }

  const rulePoints = toSafeNumber(rule.points, 0);
  const points = Math.min(rulePoints, MONTHLY_CAP - monthly);
  if (points <= 0) {
    return { awarded: false, reason: 'NO_POINTS_AVAILABLE' };
  }

  await repo.insertRewardEvent({
    u_id,
    action_key,
    action_type: 'one_time',
    points,
    activity_date: new Date()
  });

  return {
    awarded: true,
    points,
    action_key
  };
};

/* ===============================
   DAILY CHECKIN
================================ */
const awardDailyCheckin = async (u_id) => {
  const rule = await repo.getRule(DAILY_CHECKIN_KEY, 'daily');
  if (!rule) {
    return { awarded: false, reason: 'RULE_NOT_FOUND' };
  }

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) {
    return { awarded: false, reason: 'MONTHLY_CAP_REACHED' };
  }

  const lastCheckin = await repo.getLastEventByAction(
    u_id,
    DAILY_CHECKIN_KEY,
    'daily'
  );

  if (lastCheckin?.created_at) {
    const nextAvailableAtMs = new Date(lastCheckin.created_at).getTime() + HOURS_24_MS;
    if (Date.now() < nextAvailableAtMs) {
      return {
        awarded: false,
        reason: 'COOLDOWN',
        last_completed_at: new Date(lastCheckin.created_at).toISOString(),
        next_available_at: new Date(nextAvailableAtMs).toISOString()
      };
    }
  }

  const basePoints = toSafeNumber(rule.points, 0);
  const points = Math.min(basePoints, MONTHLY_CAP - monthly);
  if (points <= 0) {
    return { awarded: false, reason: 'NO_POINTS_AVAILABLE' };
  }

  await repo.insertRewardEvent({
    u_id,
    action_key: DAILY_CHECKIN_KEY,
    action_type: 'daily',
    points,
    activity_date: new Date()
  });

  await checkWeeklyMilestones(u_id);

  const now = Date.now();
  return {
    awarded: true,
    points,
    last_completed_at: new Date(now).toISOString(),
    next_available_at: new Date(now + HOURS_24_MS).toISOString()
  };
};

/* ===============================
   DAILY QUIZ
================================ */
const awardDailyQuiz = async (u_id, correctAnswers) => {
  const rule = await repo.getRule(DAILY_QUIZ_KEY, 'daily');
  if (!rule) {
    return { awarded: false, reason: 'RULE_NOT_FOUND' };
  }

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) {
    return { awarded: false, reason: 'MONTHLY_CAP_REACHED' };
  }

  const todayEvents = await repo.getTodayStatus(u_id);
  const todayQuizPoints = toSafeNumber(
    todayEvents.find((event) => event.action_key === DAILY_QUIZ_KEY)?.points,
    0
  );

  const maxPointsPerDay = toSafeNumber(rule.max_points_per_day, toSafeNumber(rule.points, 0));
  const remainingDayCap = Math.max(maxPointsPerDay - todayQuizPoints, 0);
  const basePoints = Math.min(toSafeNumber(correctAnswers, 0), remainingDayCap);
  const points = Math.min(basePoints, MONTHLY_CAP - monthly);

  if (points <= 0) {
    return { awarded: false, reason: 'NO_POINTS_AVAILABLE' };
  }

  await repo.insertRewardEvent({
    u_id,
    action_key: DAILY_QUIZ_KEY,
    action_type: 'daily',
    points,
    activity_date: new Date()
  });

  return {
    awarded: true,
    points
  };
};

/* ===============================
   SCORE TASK ELIGIBILITY + AWARD
================================ */
const checkScoreEligibility = async (task_type, score) => {
  if (!task_type || task_type === DAILY_CHECKIN_KEY || task_type === DAILY_QUIZ_KEY) {
    return {
      task_type,
      score: toSafeNumber(score, 0),
      required_score: null,
      eligible: false,
      reason: 'TASK_NOT_SCORE_BASED'
    };
  }

  const rule = await repo.getRule(task_type, 'daily');
  if (!rule) {
    return {
      task_type,
      score: toSafeNumber(score, 0),
      required_score: null,
      eligible: false,
      reason: 'RULE_NOT_FOUND'
    };
  }

  const normalizedScore = toSafeNumber(score, 0);
  const requiredScore = toPositiveNullableNumber(rule.required_score);

  if (requiredScore === null) {
    return {
      task_type,
      score: normalizedScore,
      required_score: null,
      rule_points: toSafeNumber(rule.points, 0),
      eligible: false,
      reason: 'SCORE_RULE_NOT_CONFIGURED'
    };
  }

  return {
    task_type,
    score: normalizedScore,
    required_score: requiredScore,
    rule_points: toSafeNumber(rule.points, 0),
    eligible: normalizedScore >= requiredScore
  };
};

const awardScoreTask = async (u_id, task_type, score) => {
  const eligibility = await checkScoreEligibility(task_type, score);
  if (!eligibility.eligible) {
    return {
      awarded: false,
      reason: eligibility.reason || 'NOT_ELIGIBLE',
      ...eligibility
    };
  }

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) {
    return {
      awarded: false,
      reason: 'MONTHLY_CAP_REACHED',
      ...eligibility
    };
  }

  const points = Math.min(toSafeNumber(eligibility.rule_points, 0), MONTHLY_CAP - monthly);
  if (points <= 0) {
    return {
      awarded: false,
      reason: 'NO_POINTS_AVAILABLE',
      ...eligibility
    };
  }

  await repo.insertRewardEvent({
    u_id,
    action_key: task_type,
    action_type: 'daily',
    points,
    activity_date: new Date()
  });

  return {
    awarded: true,
    points,
    ...eligibility
  };
};

/* ===============================
   CONSISTENCY MILESTONE
================================ */
const checkWeeklyMilestones = async (u_id) => {
  const streak = await repo.getDailyStreak(u_id);
  const weeks = Math.floor(streak / 7);

  if (weeks < 1 || weeks > 4) return;

  const alreadyGiven = await repo.hasMilestoneReward(u_id, weeks);
  if (alreadyGiven) return;

  const rule = await repo.getRule(
    DAILY_CHECKIN_KEY,
    'consistency',
    weeks
  );
  if (!rule) return;

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const points = Math.min(toSafeNumber(rule.points, 0), MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: DAILY_CHECKIN_KEY,
    action_type: 'consistency',
    points,
    milestone_weeks: weeks,
    activity_date: new Date()
  });
};

/* ===============================
   ARENA METADATA + STATUS
================================ */
const getArenaContestMetadata = async () => {
  return await getTaskDefinitions();
};

const getArenaContestStatus = async (u_id) => {
  const metadata = await getArenaContestMetadata();
  const actionKeys = Array.from(new Set(metadata.map((task) => task.task_type)));
  const completionRows = await repo.getContestTaskCompletions(u_id, actionKeys);

  return metadata.map((task) => {
    const summary = getTaskSummaryFromCompletions(completionRows, task.task_type);

    let completed = task.action_type === 'one_time' && summary.completionCount > 0;
    let cooldownActive = false;
    let nextAvailableAt = null;
    let eligible = true;

    if (task.task_type === DAILY_CHECKIN_KEY && summary.lastCompletedAt) {
      const nextAvailableAtMs = new Date(summary.lastCompletedAt).getTime() + HOURS_24_MS;
      if (Date.now() < nextAvailableAtMs) {
        cooldownActive = true;
        nextAvailableAt = new Date(nextAvailableAtMs).toISOString();
      }

      completed = false;
      eligible = !cooldownActive;
    }

    return {
      task_type: task.task_type,
      action_type: task.action_type,
      points: task.points,
      required_score: task.required_score,
      repeatable: task.repeatable,
      completed,
      cooldown_active: cooldownActive,
      eligible,
      last_completed_at: summary.lastCompletedAt,
      next_available_at: nextAvailableAt
    };
  });
};

/* ===============================
   LEADERBOARD
================================ */
const getLeaderboard = async (type = 'monthly', page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  let rows = [];
  let total = 0;

  if (type === 'lifetime') {
    rows = await repo.getLifetimeLeaderboard(safeLimit, offset);
    total = await repo.getLifetimeLeaderboardCount();
  } else {
    rows = await repo.getMonthlyLeaderboard(safeLimit, offset);
    total = await repo.getMonthlyLeaderboardCount();
  }

  const items = rows.map((row) => ({
    rank: Number(row.rank),
    points: Number(row.total_points),
    u_id: row.u_id,
    username: row.username || row.u_id
  }));

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1)
  };
};

const getMyRank = async (u_id, type = 'monthly') => {
  if (type === 'lifetime') {
    return await repo.getUserLifetimeRank(u_id);
  }

  return await repo.getUserMonthlyRank(u_id);
};

/* ===============================
   STREAK
================================ */
const getCurrentStreak = async (u_id) => {
  return await repo.getDailyStreak(u_id);
};

const getStreakSummary = async (u_id) => {
  const [currentStreak, longestStreak, lastCheckinDate] = await Promise.all([
    repo.getDailyStreak(u_id),
    repo.getLongestDailyStreak(u_id),
    repo.getLastCheckinDate(u_id)
  ]);

  return {
    current_streak: Number(currentStreak),
    longest_streak: Number(longestStreak),
    last_checkin_date: lastCheckinDate
  };
};

const getTodayTaskStatus = async (u_id) => {
  const todayEvents = await repo.getTodayStatus(u_id);
  const lastCheckin = await repo.getLastEventByAction(u_id, DAILY_CHECKIN_KEY, 'daily');

  const status = {
    daily_checkin_completed: false,
    daily_checkin_last_completed_at: null,
    daily_checkin_next_available_at: null,
    daily_quiz_points_today: 0
  };

  todayEvents.forEach((event) => {
    if (event.action_key === DAILY_CHECKIN_KEY) {
      status.daily_checkin_completed = true;
    }

    if (event.action_key === DAILY_QUIZ_KEY) {
      status.daily_quiz_points_today = Number(event.points);
    }
  });

  if (lastCheckin?.created_at) {
    const lastCompletedAt = new Date(lastCheckin.created_at).toISOString();
    const nextAvailableAtMs = new Date(lastCheckin.created_at).getTime() + HOURS_24_MS;
    const nextAvailableAt = new Date(nextAvailableAtMs).toISOString();

    status.daily_checkin_last_completed_at = lastCompletedAt;
    status.daily_checkin_next_available_at = nextAvailableAt;

    if (Date.now() < nextAvailableAtMs) {
      status.daily_checkin_completed = true;
    }
  }

  return status;
};

/* ===============================
   HISTORY
================================ */
const getRewardHistory = async (u_id, page = 1, limit = 20) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    repo.getUserRewardHistory(u_id, safeLimit, offset),
    repo.getUserRewardHistoryCount(u_id)
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1)
  };
};

/* ===============================
   CATALOG + REDEEM
================================ */
const getRewardCatalog = async (page = 1, limit = 12) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const offset = (safePage - 1) * safeLimit;

  try {
    const items = await repo.getRewardCatalogItems(safeLimit, offset);
    const total = await repo.getRewardCatalogCount();

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1)
    };
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    return {
      items: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
      totalPages: 1
    };
  }
};

const redeemReward = async (u_id, reward_id) => {
  let reward;
  try {
    reward = await repo.getRewardById(reward_id);
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    return {
      redeemed: false,
      reason: 'CATALOG_NOT_CONFIGURED'
    };
  }

  if (!reward) {
    return {
      redeemed: false,
      reason: 'REWARD_NOT_FOUND'
    };
  }

  const availablePoints = await repo.getTotalPoints(u_id);
  if (availablePoints < reward.points) {
    return {
      redeemed: false,
      reason: 'INSUFFICIENT_POINTS',
      required_points: reward.points,
      current_points: availablePoints
    };
  }

  await repo.insertRewardEvent({
    u_id,
    action_key: `redeem_${reward.reward_id}`,
    action_type: 'one_time',
    points: -Math.abs(toSafeNumber(reward.points, 0)),
    activity_date: new Date()
  });

  return {
    redeemed: true,
    reward,
    current_points: availablePoints - reward.points
  };
};
const createRule = async (data) => {
  return await repo.createRule(data);
};

const updateRule = async (id, data) => {
  return await repo.updateRule(id, data);
};
const getContestStats = async () => {
  return await repo.getContestStats();
};

module.exports = {
  awardOneTime,
  awardDailyCheckin,
  awardDailyQuiz,
  awardScoreTask,
  checkScoreEligibility,
  getGroupedRules,
  getArenaContestMetadata,
  getArenaContestStatus,
  getLeaderboard,
  getMyRank,
  getCurrentStreak,
  getStreakSummary,
  getTodayTaskStatus,
  getRewardHistory,
  getRewardCatalog,
  redeemReward,
  getContestStats,
  createRule,
  updateRule

};
