import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const authController = {
  registerController: catchAsync(async (req: Request, res: Response) => {
    return sendResponse(res, 201, {
      success: true,
      message: "Account Created Successfully",
    });
  }),
};
