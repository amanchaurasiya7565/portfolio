import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload, { uploadAudioMiddleware } from "../middleware/uploadMiddleware.js";
import { uploadImage, uploadAudio } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  uploadImage
);

router.post(
  "/audio",
  authMiddleware,
  uploadAudioMiddleware.single("audio"),
  uploadAudio
);

export default router;