import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getProjects);
router.post("/", authenticateToken, createProject);

export default router;
