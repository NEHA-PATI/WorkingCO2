const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/db');

router.get('/', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'OK',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});
router.get('/ready', (req, res) => {
  res.status(200).json({ ready: true });
});
module.exports = router;