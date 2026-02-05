const service = require('./reward.service');

exports.oneTime = async (req, res, next) => {
  try {
    await service.awardOneTime(req.u_id, req.body.action_key);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.dailyCheckin = async (req, res, next) => {
  try {
    await service.awardDailyCheckin(req.u_id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.dailyQuiz = async (req, res, next) => {
  try {
    const { correctAnswers } = req.body;
    await service.awardDailyQuiz(req.u_id, correctAnswers);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
