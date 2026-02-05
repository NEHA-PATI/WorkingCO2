const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./reward.controller');

router.post('/one-time', auth, controller.oneTime);
router.post('/daily-checkin', auth, controller.dailyCheckin);
router.post('/daily-quiz', auth, controller.dailyQuiz);

module.exports = router;
