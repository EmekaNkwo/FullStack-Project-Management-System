import { Router } from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
} from "../controllers/taskController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, createTask);
router.patch("/:taskId/status", authenticateToken, updateTaskStatus);
router.get("/user/:userId", authenticateToken, getUserTasks);

export default router;
