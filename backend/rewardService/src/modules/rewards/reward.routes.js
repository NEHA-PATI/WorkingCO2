const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./reward.controller');

/* ===============================
   REWARD ACTIONS
================================ */

router.post('/one-time', auth, controller.oneTime);

router.post('/daily-checkin', auth, controller.dailyCheckin);

router.post('/daily-quiz', auth, controller.dailyQuiz);
router.post('/score-task', auth, controller.scoreTask);
router.post('/eligibility-check', auth, controller.checkEligibility);
router.post('/redeem', auth, controller.redeemReward);

/* ===============================
   FETCH DATA
================================ */

router.get('/health', controller.health);
router.get('/my-points', auth, controller.getMyPoints);

router.get('/rule-points', auth, controller.getRulePoints);
router.get('/config', controller.getRewardConfig);
router.get('/contest-metadata', controller.getContestMetadata);
router.get('/contest-status', auth, controller.getContestStatus);
router.get('/catalog', controller.getRewardCatalog);
router.get('/catalog-admin', auth, controller.getRewardCatalogAdmin);
router.post('/catalog-admin', auth, controller.createRewardCatalogItem);
router.put('/catalog-admin/:reward_id', auth, controller.updateRewardCatalogItem);
router.delete('/catalog-admin/:reward_id', auth, controller.deleteRewardCatalogItem);
router.get('/leaderboard', controller.getLeaderboard);
router.get('/my-rank', auth, controller.getMyRank);
router.get('/streak', auth, controller.getStreak);
router.get('/today-status', auth, controller.getTodayStatus);
router.get('/history', auth, controller.getRewardHistory);
router.get('/contest-stats', auth,controller.getContestStats);
router.post('/rule', auth, controller.createRule);
router.put('/rule/:id', auth, controller.updateRule);

module.exports = router;
