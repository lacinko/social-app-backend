import express from "express";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  getPostsByCollectionIdHandler,
  getPostsHandler,
  updatePostHandler,
} from "../controllers/post.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  getPostsByCollectionIdSchema,
  updatePostSchema,
} from "../schemas/post.schema";

const router = express.Router();

router.route("/").get(getPostsHandler);

router.use(deserializeUser, requireUser);

router.route("/").post(validate(createPostSchema), createPostHandler);

router
  .route("/collection/:collectionId")
  .get(validate(getPostsByCollectionIdSchema), getPostsByCollectionIdHandler);

router
  .route("/:postId")
  .get(validate(getPostSchema), getPostHandler)
  .patch(validate(updatePostSchema), updatePostHandler)
  .delete(validate(deletePostSchema), deletePostHandler);

export default router;
