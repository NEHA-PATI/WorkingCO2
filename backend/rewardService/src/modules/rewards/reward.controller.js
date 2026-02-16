const service = require('./reward.service');

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

    await service.awardOneTime(req.u_id, action_key);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DAILY CHECKIN
================================ */
exports.dailyCheckin = async (req, res, next) => {
  try {
    await service.awardDailyCheckin(req.u_id);

    res.json({ success: true });
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

    await service.awardDailyQuiz(req.u_id, correctAnswers);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   GET MY POINTS SUMMARY
================================ */
exports.getMyPoints = async (req, res, next) => {
  try {
    const monthly = await require('./reward.repository')
      .getMonthlyPoints(req.u_id);

    res.json({
      success: true,
      monthlyPoints: monthly
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

    const rule = await require('./reward.repository')
      .getRule(
        action_key,
        action_type,
        milestone_weeks ? parseInt(milestone_weeks) : null
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
   GET LEADERBOARD
================================ */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { type } = req.query; // monthly | lifetime

    const data = await service.getLeaderboard(type);

    res.json({
      success: true,
      data
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
    const streak = await service.getCurrentStreak(req.u_id);

    res.json({
      success: true,
      current_streak: streak
    });
  } catch (err) {
    next(err);
  }
};
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const data = await service.getRewardHistory(
      req.u_id,
      page,
      limit
    );

    res.json({
      success: true,
      page,
      limit,
      data
    });
  } catch (err) {
    next(err);
  }
};
exports.getContestStats = async (req, res, next) => {
  try {
    const data = await service.getContestStats();


    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};
exports.createRule = async (req, res) => {
  try {
    const data = await service.createRule(req.body);

    return res.status(201).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Create rule error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      points,
      max_points_per_day,
      is_active
    } = req.body;

    const updated = await service.updateRule(id, {
      points,
      max_points_per_day,
      is_active
    });

    return res.status(200).json({
      success: true,
      message: "Rule updated",
      data: updated
    });

  } catch (error) {
    console.error("Update rule error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
