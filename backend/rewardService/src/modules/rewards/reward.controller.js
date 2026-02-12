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
