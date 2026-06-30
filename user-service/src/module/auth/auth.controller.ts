import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { setSessionIdCookie } from "../../utils/authHelpers.js";
import { authService } from "./auth.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const authController = {
  sendOTP: catchAsync(async (req: Request, res: Response) => {
    const { otpSessionId } = await authService.sendOTP(req.body);

    setSessionIdCookie(res, otpSessionId);
  }),

  verifyOTP: catchAsync(async (req: Request, res: Response) => {
    const { otp } = req.body;
    const otpSessoinId = req.cookies.otp_session;
    console.log(otp, otpSessoinId);
    const result = await authService.verifyOTP(otp, otpSessoinId);
    return sendResponse(res, 201, {
      success: true,
      message: "User created Successfully",
      data: result,
    });
  }),
};
