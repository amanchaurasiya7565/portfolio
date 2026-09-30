import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/login", validateLogin, loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", authMiddleware, getCurrentAdmin);

export default router;
