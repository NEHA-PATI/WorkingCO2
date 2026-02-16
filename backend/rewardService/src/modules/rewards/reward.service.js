const repo = require('./reward.repository');
const { MONTHLY_CAP } = require('../../config/constants');

/* ===============================
   ONE TIME
================================ */
const awardOneTime = async (u_id, action_key) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule(action_key, 'one_time');
  if (!rule) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key,
    action_type: 'one_time',
    points
  });
};

/* ===============================
   DAILY CHECKIN
================================ */
const awardDailyCheckin = async (u_id) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const alreadyDone = await repo.hasEventToday(
    u_id,
    'daily_checkin',
    'daily'
  );
  if (alreadyDone) return;

  const rule = await repo.getRule('daily_checkin', 'daily');
  if (!rule) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'daily',
    points,
    activity_date: new Date()
  });

  await checkWeeklyMilestones(u_id);
};

/* ===============================
   DAILY QUIZ
================================ */
const awardDailyQuiz = async (u_id, correctAnswers) => {
  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const rule = await repo.getRule('daily_quiz', 'daily');
  if (!rule) return;

  const basePoints = Math.min(correctAnswers, rule.max_points_per_day);
  const points = Math.min(basePoints, MONTHLY_CAP - monthly);

  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_quiz',
    action_type: 'daily',
    points,
    activity_date: new Date()
  });
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
    'daily_checkin',
    'consistency',
    weeks
  );
  if (!rule) return;

  const monthly = await repo.getMonthlyPoints(u_id);
  if (monthly >= MONTHLY_CAP) return;

  const points = Math.min(rule.points, MONTHLY_CAP - monthly);
  if (points <= 0) return;

  await repo.insertRewardEvent({
    u_id,
    action_key: 'daily_checkin',
    action_type: 'consistency',
    points,
    milestone_weeks: weeks,
    activity_date: new Date()
  });
};
/* ===============================
   GROUPED RULES FOR FRONTEND
================================ */
const getGroupedRules = async () => {
  const rules = await repo.getAllActiveRules();

  const grouped = {};

  rules.forEach(rule => {
    const {
      rule_id,
      action_key,
      action_type,
      points,
      milestone_weeks,
      max_points_per_day,
      is_active
    } = rule;

    // 🔥 First time initialize object properly
    if (!grouped[action_key]) {
      grouped[action_key] = {
        rule_id,       // ✅ add this
        is_active      // ✅ add this
      };
    }

    if (action_type === 'consistency') {

      if (!grouped[action_key].consistency) {
        grouped[action_key].consistency = {};
      }

      grouped[action_key].consistency[milestone_weeks] = points;

    } else if (action_type === 'daily') {

      grouped[action_key].daily = {
        points_per_action: points,
        max_per_day: max_points_per_day || null
      };

    } else {

      grouped[action_key][action_type] = {
        points
      };
    }
  });

  return grouped;
};


const getLeaderboard = async (type = 'monthly') => {
  if (type === 'lifetime') {
    return await repo.getLifetimeLeaderboard();
  }
  return await repo.getMonthlyLeaderboard();
};

const getMyRank = async (u_id) => {
  return await repo.getUserMonthlyRank(u_id);
};

/* ===============================
   GET CURRENT STREAK
================================ */
const getCurrentStreak = async (u_id) => {
  return await repo.getDailyStreak(u_id);
};

const getTodayTaskStatus = async (u_id) => {
  const todayEvents = await repo.getTodayStatus(u_id);

  const status = {
    daily_checkin_completed: false,
    daily_quiz_points_today: 0
  };

  todayEvents.forEach(event => {
    if (event.action_key === 'daily_checkin') {
      status.daily_checkin_completed = true;
    }

    if (event.action_key === 'daily_quiz') {
      status.daily_quiz_points_today = Number(event.points);
    }
  });

  return status;
};

const getRewardHistory = async (u_id, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  return await repo.getUserRewardHistory(u_id, limit, offset);
};

const getContestStats = async () => {
  return await repo.getContestStats();
};

/* ===============================
   CREATE RULE
================================ */
const createRule = async (data) => {

  // Optional validation logic
  if (data.action_type === 'consistency' && !data.milestone_weeks) {
    throw new Error("milestone_weeks required for consistency rule");
  }

  return await repo.createRule(data);
};


/* ===============================
   UPDATE RULE
================================ */
const updateRule = async (rule_id, data) => {
  return await repo.updateRule(rule_id, data);
};

module.exports = {
  awardOneTime,
  awardDailyCheckin,
  awardDailyQuiz,
  getGroupedRules,
  getLeaderboard,
  getMyRank,
  getCurrentStreak,
  getTodayTaskStatus,
  getRewardHistory,
  getContestStats,
  createRule,
  updateRule

};
