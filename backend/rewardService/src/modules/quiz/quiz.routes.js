const router = require('express').Router();
const multer = require('multer');
const auth = require('../../middlewares/auth.middleware');
const controller = require('./quiz.controller');

const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   ADMIN QUIZ ROUTES
================================ */

/* ADMIN */
router.post('/admin/upload-csv', auth, upload.single('file'), controller.uploadCsv);
router.get('/admin/status', auth, controller.getStatus);
router.get('/admin/preview', auth, controller.getPreview);



/* ===============================
   USER QUIZ ROUTES
================================ */

// router.get('/api/v1/quiz/questions', controller.getQuestions);
// router.post('/api/v1/quiz/submit', controller.submitQuiz);
/* USER */
router.get('/questions', auth, controller.getQuestions);
router.post('/submit', auth, controller.submitQuiz);


module.exports = router;
