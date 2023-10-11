import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionSchema,
  getCollectionsAccountsSchema,
  updateCollectionSchema,
} from "../schemas/collection.schema";
import {
  createCollectionHandler,
  deleteCollectionHandler,
  getCollectionHandler,
  getCollectionsAccountsHandler,
  getCollectionsHandler,
  joinCollectionHandler,
  leaveCollectionHandler,
  updateCollectionHandler,
} from "../controllers/collection.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

router
  .route("/")
  .get(getCollectionsHandler)
  .post(validate(createCollectionSchema), createCollectionHandler);

router
  .route("/accounts")
  .get(validate(getCollectionsAccountsSchema), getCollectionsAccountsHandler);

router
  .route("/accounts/:collectionId")
  .post(joinCollectionHandler)
  .delete(/*validate(getCollectionsAccountsSchema),*/ leaveCollectionHandler);

router
  .route("/:collectionId")
  .get(validate(getCollectionSchema), getCollectionHandler)
  .patch(validate(updateCollectionSchema), updateCollectionHandler)
  .delete(validate(deleteCollectionSchema), deleteCollectionHandler);

export default router;
