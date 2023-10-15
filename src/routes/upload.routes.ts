import express from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { updateUserHandler } from "../controllers/user.controller";
import { uploadPostImageDisk } from "../upload/single-upload-disk";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.route("/").post(uploadPostImageDisk, updateUserHandler);

export default router;
