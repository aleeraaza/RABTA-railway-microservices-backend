import "dotenv/config";
import packageJson from "../../package.json" with { type: "json" };

export const config = {
  SERVICE_NAME: packageJson.name,
  PORT: Number(process.env.PORT) || 4001,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONFIG_MAIL_SEND: process.env.CONFIG_MAIL_SEND,
  CONFIG_OTP_TTL: process.env.CONFIG_OTP_TTL,
  OTP_RATE_MAX_PER_HOUR: process.env.OTP_RATE_MAX_PER_HOUR as string,
  OTP_MAX_VERIFY_ATTEMPTS: process.env.OTP_MAX_VERIFY_ATTEMPTS as string,
  OTP_HMAC_SECRET: process.env.OTP_HMAC_SECRET,
  OTP_TTL: process.env.OTP_TTL,
  REDIS_URL: process.env.REDIS_URL,
};
