import { Router } from "express";

import { createTeam, getTeams, getTeam } from "../controllers/teamController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getTeams);
router.post("/", authenticateToken, createTeam);
router.get("/:teamId", authenticateToken, getTeam);

export default router;
