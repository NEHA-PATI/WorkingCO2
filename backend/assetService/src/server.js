const app = require("./app");
const config = require("./config/env");
const logger = require("./utils/logger");
const { pool } = require("./config/database");

const PORT = process.env.PORT || config.port || 5000;

/* ==================== SERVER START ==================== */
const startServer = async () => {
  try {
    // 🔥 Bind to 0.0.0.0 (VERY IMPORTANT FOR AWS)
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info("========================================");
      logger.info("🚀 CO2+ Asset Service Started");
      logger.info(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`🌐 Server: http://0.0.0.0:${PORT}`);
      logger.info(`📊 API Base: http://0.0.0.0:${PORT}/api/v1`);
      logger.info(`🏥 Health: http://0.0.0.0:${PORT}/api/v1/health`);
      logger.info("========================================");
    });

    /* ==================== DB CONNECTION TEST ==================== */
    try {
      const res = await pool.query("SELECT NOW()");
      logger.info(`🕒 DB Connected. Time: ${res.rows[0].now}`);
    } catch (err) {
      logger.error("❌ Database connection failed:", err.message);
    }

    /* ==================== DB ERROR HANDLER ==================== */
    pool.on("error", (err) => {
      logger.error("❌ Unexpected DB error:", err);
      process.exit(1); // restart container
    });

    /* ==================== GRACEFUL SHUTDOWN ==================== */
    const shutdown = async (signal) => {
      logger.warn(`⚠️ ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info("✅ HTTP server closed");

        try {
          await pool.end();
          logger.info("✅ Database pool closed");
        } catch (err) {
          logger.error("❌ Error closing DB pool", err);
        }

        process.exit(0);
      });

      // 🔥 Force shutdown fallback
      setTimeout(() => {
        logger.error("⏱ Force shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("❌ Server failed to start", error);
    process.exit(1);
  }
};

startServer();