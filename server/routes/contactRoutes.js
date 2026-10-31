import express from "express";
import {
  sendContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendContactMessage);
router.get("/messages", authMiddleware, getContactMessages);
router.delete("/messages/:id", authMiddleware, deleteContactMessage);

export default router;
