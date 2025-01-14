import { Router } from "express";

import { getUser, getUsers, postUser } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getUsers);
router.post("/", authenticateToken, postUser);
router.get("/:userId", authenticateToken, getUser);

export default router;
