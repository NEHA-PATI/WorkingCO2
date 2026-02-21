const app = require('./app');
require('dotenv').config();
const factorCache = require('./src/services/factorCache.service');
const airportCache = require('./src/services/airportCache.service');

(async () => {
  await factorCache.loadFactors();
  await airportCache.loadAirports();
})();

const PORT = process.env.PORT 
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`🚀 CFCService running on port ${PORT}`);
});

