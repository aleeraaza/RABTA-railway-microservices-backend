import { string } from "zod";
import type { CreateUserDTO } from "../../schemas/auth.schema.js";
import { hashPassword } from "../../utils/authHelpers.js";
import { sendOtpEmail } from "../../utils/email.js";
import { BadRequestError, ConflictError } from "../../utils/error.js";
import { generateAndStoreOTP, verifyotp } from "../../utils/otp.js";
import { createUser, findUserByEmail } from "./auth.repository.js";

export const authService = {
  sendOTP: async (body: CreateUserDTO) => {
    const { email, firstName, lastName, password } = body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User already exists!");
    }
    const hashedPassword = await hashPassword(password as string);
    const meta = { email, firstName, lastName, hashedPassword };
    const { otp, otpSessionId } = await generateAndStoreOTP(meta);
    await sendOtpEmail(email, otp);

    return { otpSessionId };
  },

  verifyOTP: async (otp: string, otpSessoinId: string) => {
    const meta = await verifyotp(otp, otpSessoinId);
    if (meta === null) {
      throw new BadRequestError("Invalid or expired OTP!");
    }

    return await createUser(meta);
  },
};
