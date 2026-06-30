import bcrypt from "bcrypt";
import crypto from "crypto";
import type { Response } from "express";
import { config } from "../config/index.js";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

// export const verifyHashedPassword = async (
//   password: string,
//   hashedPassword: string,
// ) => {
//   return await bcrypt.compare(password, hashedPassword);
// };

// export const hashRefreshToken = (refreshToken: string) => {
//   return crypto.createHash("sha256").update(refreshToken).digest("hex");
// };

// export const setTokenCookies = (
//   res: Response,
//   accessToken: string,
//   refreshToken: string,
// ) => {
//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: config.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 15 * 60 * 1000,
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: config.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//   });
// };

// export const destroyCookies = (res: Response) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     secure: config.NODE_ENV === "production",
//     sameSite: "lax",
//   });
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: config.NODE_ENV === "production",
//     sameSite: "lax",
//   });
// };

// export const comparePassword = async ({
//   hashedPassword,
//   userPassword,
// }: {
//   hashedPassword: string;
//   userPassword: string;
// }) => {
//   const isMatch = await bcrypt.compare(userPassword, hashedPassword);

//   return isMatch;
// };

export const setSessionIdCookie = (res: Response, otpSessionId: string) => {
  res
    .cookie("otp_session", otpSessionId, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "OTP sent successfully!",
    });
};
