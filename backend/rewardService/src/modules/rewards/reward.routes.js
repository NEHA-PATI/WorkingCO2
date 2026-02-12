const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./reward.controller');

/* ===============================
   REWARD ACTIONS
================================ */

router.post('/one-time', auth, controller.oneTime);

router.post('/daily-checkin', auth, controller.dailyCheckin);

router.post('/daily-quiz', auth, controller.dailyQuiz);

/* ===============================
   FETCH DATA
================================ */

router.get('/my-points', auth, controller.getMyPoints);

router.get('/rule-points', auth, controller.getRulePoints);
router.get('/config', controller.getRewardConfig);
router.get('/leaderboard', controller.getLeaderboard);
router.get('/my-rank', auth, controller.getMyRank);
router.get('/streak', auth, controller.getStreak);
router.get('/today-status', auth, controller.getTodayStatus);
router.get('/history', auth, controller.getRewardHistory);

module.exports = router;
