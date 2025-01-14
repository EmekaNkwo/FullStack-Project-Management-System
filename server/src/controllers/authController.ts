import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { excludePassword, generateFiveDigitNumber } from "../lib/generateId";
import { handleServerError } from "../lib/handleServerError";
import { generateToken } from "../lib/genetateToken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email is already registered" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    // Password validation
    if (!password || password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userId: generateFiveDigitNumber(),
        email,
        password: hashedPassword,
        fullName,
        role: "STAFF", // Default role
        teamId: null, // Optional team assignment
        username: email.split("@")[0], // Generate username from email
      },
    });
    const sanitizedUser = excludePassword(user);
    // Generate token
    const token = generateToken(user.userId, user.email);
    res.status(201).json({
      message: "User registered successfully",
      user: sanitizedUser,
      token,
    });
  } catch (error: unknown) {
    handleServerError(res, error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.userId, user.email);

    res.json({
      message: "Login successful",
      token,
      user: excludePassword(user),
    });
  } catch (error) {
    handleServerError(res, error, "Error during login");
  }
};

export const getLoggedInUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ensure req.user exists and has userId
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { userId: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const sanitizedUser = excludePassword(user);
    res.json(sanitizedUser);
  } catch (error: unknown) {
    handleServerError(res, error, "Error retrieving user");
  }
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: "Sign out successful" });
  } catch (error: unknown) {
    handleServerError(res, error, "Error signing out");
  }
};
