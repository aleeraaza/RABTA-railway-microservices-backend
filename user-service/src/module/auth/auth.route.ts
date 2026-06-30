import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema } from "../../schemas/auth.schema.js";
import { authController } from "./auth.controller.js";

const router = Router();

router
  .route("/send-otp")
  .post(validate(registerSchema), authController.sendOTP);
router.route("/verify-otp").post(authController.verifyOTP);

export default router;
