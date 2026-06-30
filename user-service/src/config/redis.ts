import { Redis } from "ioredis";
import type { Redis as RedisClientType } from "ioredis";
import { config } from "./index.js";
import { logger } from "./logger.js";

class RedisClient {
  private static instance: RedisClientType | null = null;
  private static isConnectedFlag = false;

  // prevent instantiation
  private constructor() {}

  public static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.REDIS_URL!, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      RedisClient.setupEventListeners();
    }

    return RedisClient.instance;
  }

  private static setupEventListeners(): void {
    const client = RedisClient.instance;

    if (!client) return;

    client.on("connect", () => {
      RedisClient.isConnectedFlag = true;
      logger.info("Connected to Redis");
    });

    client.on("error", (error: Error) => {
      RedisClient.isConnectedFlag = false;
      logger.error("Redis connection error", error);
    });

    client.on("close", () => {
      RedisClient.isConnectedFlag = false;
      logger.warn("Redis connection closed");
    });

    client.on("reconnecting", () => {
      logger.warn("Reconnecting to Redis...");
    });

    client.on("ready", () => {
      RedisClient.isConnectedFlag = true;
      logger.warn("Redis client is ready");
    });

    client.on("end", () => {
      RedisClient.isConnectedFlag = false;
      logger.warn("Redis connection ended");
    });
  }

  public static async closeConnection(): Promise<void> {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.quit();
        logger.info("Redis connection closed");
        RedisClient.instance = null;
        RedisClient.isConnectedFlag = false;
      } catch (error) {
        logger.error("Error closing Redis connection:", error);
      }
    }
  }

  public static isReady(): boolean {
    return RedisClient.isConnectedFlag;
  }

  public static async testConnection(): Promise<boolean> {
    if (!RedisClient.instance) return false;

    try {
      await RedisClient.instance.ping();
      return true;
    } catch (error) {
      logger.error("Redis connection test failed:", error);
      return false;
    }
  }
}

// export singleton instance + class
export const redis = RedisClient.getInstance();
export { RedisClient };
