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
import {
  resizePostImages,
  uploadPostImages,
} from "../upload/multi-upload-sharp";

const router = express.Router();

router.route("/").get(getPostsHandler);

router.use(deserializeUser, requireUser);

router.route("/").post(
  uploadPostImages(5),
  resizePostImages("posts", "post", "jpeg", 90, 450, 800),
  //validate(createPostSchema),
  createPostHandler
);

router
  .route("/collection/:collectionId")
  .get(validate(getPostsByCollectionIdSchema), getPostsByCollectionIdHandler);

router
  .route("/:postId")
  .get(validate(getPostSchema), getPostHandler)
  .patch(
    uploadPostImages(5),
    resizePostImages("posts", "post", "jpeg", 90, 450, 800),
    validate(updatePostSchema),
    updatePostHandler
  )
  .delete(validate(deletePostSchema), deletePostHandler);

export default router;
