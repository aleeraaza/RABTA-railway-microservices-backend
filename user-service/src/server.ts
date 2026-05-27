import { app } from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./config/logger.js";

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} is running at ${config.PORT}`);
    });
    // Graceful shutdown
  } catch (error) {
    logger.error("Failed to start the server", error);
    process.exit(1);
  }
};

startServer();
