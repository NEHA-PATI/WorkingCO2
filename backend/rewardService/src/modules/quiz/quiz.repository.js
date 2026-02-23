const fs = require('fs/promises');
const path = require('path');

const QUIZ_DIR = path.join(__dirname, '../../../data/quiz');
const CONFIG_PATH = path.join(__dirname, '../../../data/config.json');


/* ===============================
   SAVE QUIZ JSON
================================ */
const saveQuizJSON = async (month, data) => {
  await fs.mkdir(QUIZ_DIR, { recursive: true });

  const filePath = path.join(QUIZ_DIR, `${month}.json`);
  const content = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
};

/* ===============================
   BACKUP PREVIOUS ACTIVE QUIZ
================================ */
const backupPreviousQuiz = async () => {
  const activeMonth = await getActiveMonth();
  const sourcePath = path.join(QUIZ_DIR, `${activeMonth}.json`);

  try {
    await fs.access(sourcePath);
  } catch (_) {
    return null;
  }

  await fs.mkdir(QUIZ_DIR, { recursive: true });

  const backupName = `${activeMonth}.backup.${Date.now()}.json`;
  const backupPath = path.join(QUIZ_DIR, backupName);

  await fs.copyFile(sourcePath, backupPath);
  return backupPath;
};

/* ===============================
   GET ACTIVE MONTH
================================ */
const getActiveMonth = async () => {
  const raw = await fs.readFile(CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);

  return config.activeMonth;
};

/* ===============================
   SET ACTIVE MONTH
================================ */
const setActiveMonth = async (month) => {
  const configDir = path.dirname(CONFIG_PATH);
  await fs.mkdir(configDir, { recursive: true });

  let config = {};

  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    config = JSON.parse(raw);
  } catch (_) {
    config = {};
  }

  config.activeMonth = month;

  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  return config;
};

/* ===============================
   READ ACTIVE QUIZ
================================ */
const readActiveQuiz = async () => {
  const activeMonth = await getActiveMonth();
  const filePath = path.join(QUIZ_DIR, `${activeMonth}.json`);

  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
};

/* ===============================
   FILE HELPERS
================================ */
const readCSVFromUpload = async (file) => {
  let text = file.buffer.toString('utf8');

  // Remove UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  return text;
};


module.exports = {
  saveQuizJSON,
  backupPreviousQuiz,
  getActiveMonth,
  setActiveMonth,
  readActiveQuiz,
  readCSVFromUpload
};
