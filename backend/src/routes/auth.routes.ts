import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});

router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  AuthController.register,
);
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  AuthController.login,
);
router.get("/me", authenticate, AuthController.me);

export default router;
