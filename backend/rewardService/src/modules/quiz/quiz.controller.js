const service = require('./quiz.service');

/* ===============================
   ADMIN - UPLOAD QUIZ CSV
================================ */
exports.uploadQuizCSV = async (req, res, next) => {
  try {
    const data = await service.uploadQuizCSV(req.file);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   ADMIN - GET QUIZ STATUS
================================ */
exports.getQuizStatus = async (req, res, next) => {
  try {
    const data = await service.getQuizStatus();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   ADMIN - PREVIEW QUIZ
================================ */
exports.previewQuiz = async (req, res, next) => {
  try {
    const data = await service.previewQuiz(req.query);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   USER - GET DAILY QUESTIONS
================================ */
exports.getDailyQuestions = async (req, res, next) => {
  try {
    const data = await service.getDailyQuestions(req.u_id);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   USER - SUBMIT QUIZ ANSWERS
================================ */
exports.submitQuizAnswers = async (req, res, next) => {
  try {
    const data = await service.submitQuizAnswers(req.u_id, req.body);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

// Backward-compatible aliases for existing route wiring.
exports.uploadCsv = exports.uploadQuizCSV;
exports.getStatus = exports.getQuizStatus;
exports.getPreview = exports.previewQuiz;
exports.getQuestions = exports.getDailyQuestions;
exports.submitQuiz = exports.submitQuizAnswers;
