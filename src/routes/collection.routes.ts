import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionSchema,
  updateCollectionSchema,
} from "../schemas/collection.schema";
import {
  createCollectionHandler,
  deleteCollectionHandler,
  getCollectionHandler,
  getCollectionsHandler,
  updateCollectionHandler,
} from "../controllers/collection.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

router
  .route("/")
  .post(validate(createCollectionSchema), createCollectionHandler)
  .get(getCollectionsHandler);

router
  .route("/:collectionId")
  .get(validate(getCollectionSchema), getCollectionHandler)
  .patch(validate(updateCollectionSchema), updateCollectionHandler)
  .delete(validate(deleteCollectionSchema), deleteCollectionHandler);

export default router;
