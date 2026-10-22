import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getResumeView,
  getResumeDownload,
} from "../controllers/resumeController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdf) cb(null, true);
    else cb(new Error("Only PDF files are allowed."));
  },
});

router.get("/view", getResumeView);
router.get("/download", getResumeDownload);
router.post("/", authMiddleware, upload.single("resume"), uploadResume);

export default router;
