import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createCommentSchema,
  deleteCommentSchema,
  updateCommentSchema,
} from "../schemas/comment.schema";
import {
  createCommentHandler,
  deleteCommentHandler,
  getCommentsForPostHandler,
  updateCommentHandler,
} from "../controllers/comment.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.route("/").post(validate(createCommentSchema), createCommentHandler);

router.route("/:postId/:parentId").get(getCommentsForPostHandler);

router
  .route("/:commentId")
  .patch(validate(updateCommentSchema), updateCommentHandler)
  .delete(validate(deleteCommentSchema), deleteCommentHandler);

export default router;
