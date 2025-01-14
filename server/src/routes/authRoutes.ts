import { Router } from "express";
import {
  login,
  getLoggedInUser,
  register,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);

router.post("/register", register);

router.get("/me", authenticateToken, getLoggedInUser);

export default router;
