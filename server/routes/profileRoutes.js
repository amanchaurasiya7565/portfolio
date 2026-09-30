import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProfile);

// Admin only
router.put("/", authMiddleware, updateProfile);

export default router;