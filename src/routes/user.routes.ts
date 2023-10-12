import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import {
  getMeHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { uploadPostImageDisk } from "../upload/single-upload-disk";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router
  .route("/me")
  .get(getMeHandler)
  .patch(uploadPostImageDisk, validate(updateUserSchema), updateUserHandler);

export default router;
