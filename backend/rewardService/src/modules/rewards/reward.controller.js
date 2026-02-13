const service = require('./reward.service');
const repo = require('./reward.repository');

exports.health = (_req, res) => {
  res.json({
    success: true,
    service: 'reward-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};

/* ===============================
   ONE TIME ACTION
================================ */
exports.oneTime = async (req, res, next) => {
  try {
    const { action_key } = req.body;

    if (!action_key) {
      return res.status(400).json({
        success: false,
        message: 'action_key is required'
      });
    }

    const result = await service.awardOneTime(req.u_id, action_key);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DAILY CHECKIN
================================ */
exports.dailyCheckin = async (req, res, next) => {
  try {
    const result = await service.awardDailyCheckin(req.u_id);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DAILY QUIZ
================================ */
exports.dailyQuiz = async (req, res, next) => {
  try {
    const { correctAnswers } = req.body;

    if (typeof correctAnswers !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'correctAnswers must be a number'
      });
    }

    const result = await service.awardDailyQuiz(req.u_id, correctAnswers);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   SCORE-BASED TASK ACTION
================================ */
exports.scoreTask = async (req, res, next) => {
  try {
    const { task_type, score } = req.body;

    if (!task_type) {
      return res.status(400).json({
        success: false,
        message: 'task_type is required'
      });
    }

    if (typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'score must be a number'
      });
    }

    const data = await service.awardScoreTask(req.u_id, task_type, score);

    if (data?.awarded === false) {
      return res.status(400).json({
        success: false,
        data
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   SCORE ELIGIBILITY CHECK
================================ */
exports.checkEligibility = async (req, res, next) => {
  try {
    const { task_type, score } = req.body;

    if (!task_type) {
      return res.status(400).json({
        success: false,
        message: 'task_type is required'
      });
    }

    const data = await service.checkScoreEligibility(
      task_type,
      typeof score === 'number' ? score : 0
    );

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   REDEEM REWARD
================================ */
exports.redeemReward = async (req, res, next) => {
  try {
    const { reward_id } = req.body;

    if (!reward_id) {
      return res.status(400).json({
        success: false,
        message: 'reward_id is required'
      });
    }

    const data = await service.redeemReward(req.u_id, reward_id);

    if (!data?.redeemed) {
      return res.status(400).json({
        success: false,
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET MY POINTS SUMMARY
================================ */
exports.getMyPoints = async (req, res, next) => {
  try {
    const [monthlyPoints, totalPoints] = await Promise.all([
      repo.getMonthlyPoints(req.u_id),
      repo.getTotalPoints(req.u_id)
    ]);

    res.json({
      success: true,
      monthlyPoints,
      totalPoints
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET RULE POINTS
================================ */
exports.getRulePoints = async (req, res, next) => {
  try {
    const { action_key, action_type, milestone_weeks } = req.query;

    if (!action_key || !action_type) {
      return res.status(400).json({
        success: false,
        message: 'action_key and action_type are required'
      });
    }

    const rule = await repo.getRule(
      action_key,
      action_type,
      milestone_weeks ? parseInt(milestone_weeks, 10) : null
    );

    res.json({
      success: true,
      data: rule || null
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET ALL REWARD RULES (Grouped)
================================ */
exports.getRewardConfig = async (req, res, next) => {
  try {
    const data = await service.getGroupedRules();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET ARENA CONTEST METADATA
================================ */
exports.getContestMetadata = async (req, res, next) => {
  try {
    const data = await service.getArenaContestMetadata();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET ARENA CONTEST STATUS
================================ */
exports.getContestStatus = async (req, res, next) => {
  try {
    const data = await service.getArenaContestStatus(req.u_id);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET REWARD CATALOG
================================ */
exports.getRewardCatalog = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;

    const result = await service.getRewardCatalog(page, limit);

    res.json({
      success: true,
      data: result.items,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET LEADERBOARD
================================ */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { type } = req.query; // monthly | lifetime
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await service.getLeaderboard(type, page, limit);

    res.json({
      success: true,
      data: result.items,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET MY RANK
================================ */
exports.getMyRank = async (req, res, next) => {
  try {
    const rank = await service.getMyRank(req.u_id);

    res.json({
      success: true,
      rank
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET USER STREAK
================================ */
exports.getStreak = async (req, res, next) => {
  try {
    const data = await service.getStreakSummary(req.u_id);

    res.json({
      success: true,
      ...data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET TODAY STATUS
================================ */
exports.getTodayStatus = async (req, res, next) => {
  try {
    const data = await service.getTodayTaskStatus(req.u_id);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET REWARD HISTORY
================================ */
exports.getRewardHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await service.getRewardHistory(
      req.u_id,
      page,
      limit
    );

    res.json({
      success: true,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      data: result.items
    });
  } catch (err) {
    next(err);
  }
};
