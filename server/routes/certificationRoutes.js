import express from "express";
import Certification from "../models/Certification.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCrudController } from "../controllers/crudController.js";

const router = express.Router();

const controller = createCrudController(Certification);

router.get("/", controller.getAll);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.remove);

export default router;