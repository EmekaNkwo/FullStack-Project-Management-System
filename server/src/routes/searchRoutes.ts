import { Router } from "express";
import { search } from "../controllers/searchController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, search);

export default router;
