import { config } from "../config/index.js";
import { redis } from "../config/redis.js";
import type { CreateUserDTO } from "../schemas/auth.schema.js";
import crypto from "crypto";
import { TooManyRequestsError } from "./error.js";
import otpGenerator from "otp-generator";

const RATE_MAX = parseInt(config.OTP_RATE_MAX_PER_HOUR || "5", 10);
const ATTEMPTS_MAX = parseInt(config.OTP_MAX_VERIFY_ATTEMPTS || "5", 10);
const OTP_TTL = parseInt(config.OTP_TTL || "300", 10);
const HMAC_SECRET = config.OTP_HMAC_SECRET as string;

function hmacFor(email: string, otp: string) {
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(email + ":" + otp)
    .digest("hex");
}
export const generateAndStoreOTP = async (meta: CreateUserDTO) => {
  // how many otp's you can send in an hour
  const rateKey = `otp:rate:${meta.email}`;
  const sentCount = parseInt((await redis.get(rateKey)) || "0", 10);
  if (sentCount >= RATE_MAX) {
    throw new TooManyRequestsError(
      "Too many OTP requests. Try again later.",
      "OTP_RATE_LIMIT",
    );
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otpSessionId = crypto.randomUUID();
  const hashed = hmacFor(meta.email, otp);
  await redis.set(
    `otp:session:${otpSessionId}`,
    JSON.stringify({
      hashedOtp: hashed,
      meta,
    }),
    "EX",
    OTP_TTL,
  );
  await redis.incr(rateKey);
  await redis.expire(rateKey, 3600);
  return { otp, otpSessionId };
};

export const verifyotp = async (otp: string, otpSessoinId: string) => {
  const rawData = await redis.get(`otp:session:${otpSessoinId}`);
  if (!rawData) return null;
  const { hashedOtp: storedOtp, meta } = JSON.parse(rawData);
  const attemptsKey = `otp:attempts:${meta.email}`;
  const attemptsCount = parseInt((await redis.get(attemptsKey)) || "0", 10);
  if (attemptsCount >= ATTEMPTS_MAX) {
    throw new TooManyRequestsError(
      "Too many verify otp attemps! Try again later.",
    );
  }
  console.log("Entered OTP:", otp);
  console.log("Stored session:", rawData);

  const hashedOtp = hmacFor(meta.email, otp);

  console.log("Generated hash:", hashedOtp);
  console.log("Stored hash:", storedOtp);
  if (
    crypto.timingSafeEqual(
      Buffer.from(hashedOtp, "hex"),
      Buffer.from(storedOtp, "hex"),
    )
  ) {
    await redis.del(`otp:session:${otpSessoinId}`, attemptsKey);
    await redis.del(`otp:rate:${meta.email}`);
    return meta;
  } else {
    await redis.incr(attemptsKey);
    await redis.expire(attemptsKey, OTP_TTL);
    return null;
  }
};
