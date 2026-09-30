import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateProject } from "../middleware/projectValidation.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", authMiddleware, validateProject, createProject);
router.put("/:id", authMiddleware, validateProject, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
