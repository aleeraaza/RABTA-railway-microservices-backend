import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema } from "../../schemas/auth.schema.js";

const router = Router();

router.route("/register").post(validate(registerSchema));

export default router;
