import express from "express";
import Experience from "../models/Experience.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCrudController } from "../controllers/crudController.js";

const router = express.Router();

const controller = createCrudController(Experience);

router.get("/", controller.getAll);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.remove);

export default router;