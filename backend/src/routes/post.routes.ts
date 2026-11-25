import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator";

const router = Router();

router.get("/", PostController.getAll);
router.get("/:id", PostController.getOne);

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(createPostSchema),
  PostController.create,
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(updatePostSchema),
  PostController.update,
);
router.delete("/:id", authenticate, requireAdmin, PostController.delete);

export default router;
