import express from "express";
import { sendContactMessage, getContactMessages } from "../controllers/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendContactMessage);
router.get("/messages", authMiddleware, getContactMessages);

export default router;
