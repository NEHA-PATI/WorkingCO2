const app = require("./app");
const config = require("./src/config/env");
const logger = require("./src/utils/logger");
const { pool } = require("./src/config/database");

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info("========================================");
      logger.info("🚀 Admin Service Started");
      logger.info(`📡 Environment: ${config.nodeEnv}`);
      logger.info(`🌐 Server: http://localhost:${PORT}`);
      logger.info(`📊 API Base: http://localhost:${PORT}/api/v1`);
      logger.info(`🏥 Health: http://localhost:${PORT}/api/v1/health`);
      logger.info("========================================");
    });

    /**
     * Graceful Shutdown
     */
    const shutdown = async (signal) => {
      logger.warn(`⚠️  ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info("✅ HTTP server closed");

        try {
          if (pool) {
            await pool.end();
            logger.info("✅ Database pool closed");
          }
        } catch (err) {
          logger.error("❌ Error closing DB pool", err);
        }

        process.exit(0);
      });

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
