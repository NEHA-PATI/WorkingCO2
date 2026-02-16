const router = require('express').Router();
const multer = require('multer');
const auth = require('../../middlewares/auth.middleware');
const controller = require('./quiz.controller');

const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   ADMIN QUIZ ROUTES
================================ */

router.post('/api/v1/admin/quiz/upload-csv', auth, upload.single('file'), controller.uploadCsv);
router.get('/api/v1/admin/quiz/status', auth, controller.getStatus);
router.get('/api/v1/admin/quiz/preview', auth, controller.getPreview);

/* ===============================
   USER QUIZ ROUTES
================================ */

router.get('/api/v1/quiz/questions', controller.getQuestions);
router.post('/api/v1/quiz/submit', controller.submitQuiz);

module.exports = router;
