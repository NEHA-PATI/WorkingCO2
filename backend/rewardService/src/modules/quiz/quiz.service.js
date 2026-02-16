const repo = require('./quiz.repository');
const rewardService = require('../rewards/reward.service');
let cachedQuiz = null;

/* ===============================
   HELPERS
================================ */
const REQUIRED_COLUMNS = [
  'question',
  'optionA',
  'optionB',
  'optionC',
  'optionD',
  'correctAnswer'
];

const parseCSVRow = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const normalizeHeaders = (headers) => {
  return headers.map(h => h.trim());
};

const getCurrentMonthKey = () => {
  return new Date().toISOString().slice(0, 7);
};

const buildQuizPayload = (rows) => {
  const questions = rows.map((row, index) => ({
    id: index + 1,
    question: row.question,
    options: {
      A: row.optionA,
      B: row.optionB,
      C: row.optionC,
      D: row.optionD
    },
    answer: row.correctAnswer
  }));

  return {
    month: getCurrentMonthKey(),
    questions
  };
};

const loadQuizToCache = async () => {
  try {
    const quizData = await repo.readActiveQuiz();
    cachedQuiz = quizData;
    return cachedQuiz;
  } catch (_) {
    cachedQuiz = null;
    throw new Error('Active quiz not found');
  }
};

const getCachedQuiz = async () => {
  if (cachedQuiz) {
    return cachedQuiz;
  }

  return await loadQuizToCache();
};

/* ===============================
   ADMIN - UPLOAD QUIZ CSV
================================ */
const uploadQuizCSVService = async (file) => {
  if (!file) {
    throw new Error('CSV file is required');
  }

  const csvText = await repo.readCSVFromUpload(file);
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV must include header and question rows');
  }

  const headerCells = normalizeHeaders(parseCSVRow(lines[0]));

  const hasAllRequiredColumns = REQUIRED_COLUMNS.every(
    column => headerCells.includes(column)
  );

  if (!hasAllRequiredColumns) {
    throw new Error('CSV is missing required columns');
  }

  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCSVRow(lines[i]);

    if (values.length !== headerCells.length) {
      throw new Error(`Invalid CSV row at line ${i + 1}`);
    }

    const row = {};

    headerCells.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    const answer = String(row.correctAnswer || '').trim().toUpperCase();

    if (!['A', 'B', 'C', 'D'].includes(answer)) {
      throw new Error(`correctAnswer must be A/B/C/D at line ${i + 1}`);
    }

    row.correctAnswer = answer;
    rows.push(row);
  }

  if (rows.length !== 300) {
    throw new Error('CSV must contain exactly 300 questions');
  }

  const quizData = buildQuizPayload(rows);

  let backupPath = null;
  try {
    backupPath = await repo.backupPreviousQuiz();
  } catch (_) {
    backupPath = null;
  }

  const savedFilePath = await repo.saveQuizJSON(quizData.month, quizData);
  await repo.setActiveMonth(quizData.month);
  await loadQuizToCache();

  return {
    month: quizData.month,
    totalQuestions: quizData.questions.length,
    backupPath,
    savedFilePath,
    quiz: quizData
  };
};

/* ===============================
   ADMIN - GET QUIZ STATUS
================================ */
const getQuizStatusService = async () => {
  return {
    message: 'Not implemented yet'
  };
};

/* ===============================
   ADMIN - PREVIEW QUIZ
================================ */
const previewQuizService = async () => {
  return {
    message: 'Not implemented yet'
  };
};

/* ===============================
   USER - GET DAILY QUESTIONS
================================ */
const getDailyQuestionsService = async (day) => {

  let parsedDay = Number(day);

  // If day not provided, auto-detect from date
  if (!parsedDay) {
    parsedDay = new Date().getDate();
  }

  if (!Number.isInteger(parsedDay) || parsedDay < 1 || parsedDay > 30) {
    throw new Error('day must be between 1 and 30');
  }

  const quizData = await getCachedQuiz();

  if (!quizData || !Array.isArray(quizData.questions)) {
    throw new Error('Active quiz not found');
  }

  const start = (parsedDay - 1) * 10;
  const end = start + 10;

  const questions = quizData.questions
    .slice(start, end)
    .map(question => ({
      id: question.id,
      question: question.question,
      options: question.options
    }));

  return {
    day: parsedDay,
    totalQuestions: 10,
    questions
  };
};


/* ===============================
   USER - SUBMIT QUIZ ANSWERS
================================ */
const submitQuizAnswersService = async (userId, answers) => {
  const quizData = await getCachedQuiz();
  if (!quizData || !Array.isArray(quizData.questions)) {
    throw new Error('Active quiz not found');
  }
  const submittedAnswers = Array.isArray(answers)
    ? answers
    : (answers && Array.isArray(answers.answers) ? answers.answers : []);

  const questionsById = new Map(
    (quizData.questions || []).map(question => [Number(question.id), question])
  );

  let totalCorrect = 0;
  let totalQuestionsAttempted = 0;

  const processed = new Set();

submittedAnswers.forEach(item => {

  const questionId = Number(item && item.id);
  const selectedOption = String(item && item.selectedOption ? item.selectedOption : '')
    .trim()
    .toUpperCase();

  if (!questionId || processed.has(questionId)) {
    return;
  }

  processed.add(questionId);

  const question = questionsById.get(questionId);
  if (!question) {
    return;
  }

  totalQuestionsAttempted += 1;

  if (selectedOption === String(question.answer).toUpperCase()) {
    totalCorrect += 1;
  }
});


  if (typeof rewardService.addPoints !== 'function') {
    throw new Error('Rewards addPoints function is not available');
  }

 let rewardResult = await rewardService.addPoints(
  userId,
  'daily_quiz',
  totalCorrect
);

let pointsAdded = rewardResult?.pointsAdded || 0;


  if (pointsAdded && typeof pointsAdded === 'object' && 'pointsAdded' in pointsAdded) {
    pointsAdded = pointsAdded.pointsAdded;
  }

  pointsAdded = Number(pointsAdded) || 0;

  return {
    totalCorrect,
    totalQuestionsAttempted,
    pointsAdded
  };
};

module.exports = {
  uploadQuizCSVService,
  getQuizStatusService,
  previewQuizService,
  getDailyQuestionsService,
  submitQuizAnswersService,

  // Backward-compatible aliases for current controller wiring.
  uploadQuizCSV: uploadQuizCSVService,
  getQuizStatus: getQuizStatusService,
  previewQuiz: previewQuizService,
  getDailyQuestions: getDailyQuestionsService,
  submitQuizAnswers: submitQuizAnswersService
};
