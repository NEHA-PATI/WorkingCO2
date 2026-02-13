require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Reward service running on port ${PORT}`);

  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.warn('Reward service started, but database is not connected.');
  }
});
