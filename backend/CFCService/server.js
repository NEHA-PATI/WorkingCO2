const app = require("./app");
require("dotenv").config();

const factorCache = require("./src/services/factorCache.service");
const airportCache = require("./src/services/airportCache.service");

const PORT = process.env.PORT || 8004;

/* ==================== START SERVER ==================== */
const startServer = async () => {
  try {
    console.log("🔄 Starting CFC Service...");

    // 🔥 Load cache data before starting
    await factorCache.loadFactors();
    console.log("✅ Factor cache loaded");

    await airportCache.loadAirports();
    console.log("✅ Airport cache loaded");

    // 🔥 IMPORTANT: bind 0.0.0.0 for EC2 access
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
================================
🚀 CFC Service Started
================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
================================
`);
    });

    /* ==================== GRACEFUL SHUTDOWN ==================== */
    const shutdown = (signal) => {
      console.log(`⚠️ ${signal} received. Shutting down...`);

      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });

      // force shutdown after timeout
      setTimeout(() => {
        console.error("⏱ Force shutdown");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("❌ Failed to start CFC Service:", error.message);
    process.exit(1);
  }
};

startServer();