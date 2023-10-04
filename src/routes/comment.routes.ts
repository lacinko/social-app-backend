import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { createCommentSchema } from "../schemas/comment.schema";
import {
  createCommentHandler,
  getCommentsForPostHandler,
} from "../controllers/comment.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.route("/").post(validate(createCommentSchema), createCommentHandler);

router.route("/:postId/:parentId").get(getCommentsForPostHandler);

export default router;
