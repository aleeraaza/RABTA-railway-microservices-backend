import type { Response } from "express";
import type { ApiResponse } from "../types/generic.types.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
) => {
  return res.status(statusCode).json(payload);
};
