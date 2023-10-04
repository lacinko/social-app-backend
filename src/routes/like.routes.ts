import express from "express";
import { validate } from "../middleware/validate";
import { createLikeSchema, deleteLikeSchema } from "../schemas/like.schema";
import {
  createLikeHandler,
  deleteLikeHandler,
  updateLikeHandler,
} from "../controllers/like.controller";
import { requireUser } from "../middleware/requireUser";
import { deserializeUser } from "../middleware/deserializeUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.route("/").post(validate(createLikeSchema), createLikeHandler);

router
  .route("/:likeId")
  .delete(validate(deleteLikeSchema), deleteLikeHandler)
  .patch(validate(createLikeSchema), updateLikeHandler);

export default router;
