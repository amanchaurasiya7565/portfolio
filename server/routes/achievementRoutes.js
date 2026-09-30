import express from "express";
import Achievement from "../models/Achievement.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCrudController } from "../controllers/crudController.js";

const router = express.Router();

const controller = createCrudController(Achievement);

router.get("/", controller.getAll);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.remove);

export default router;