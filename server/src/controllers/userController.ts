import { Request, Response } from "express";
import { PrismaClient, StaffRole } from "@prisma/client";
import multer from "multer";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  excludePassword,
  generateFiveDigitNumber,
  generateRandomPassword,
} from "../lib/generateId";
import emailService from "../service/emailService";

const prisma = new PrismaClient();
// const upload = multer({ dest: "uploads/" });

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    const sanitizedUsers = users.map(excludePassword);
    res.json(sanitizedUsers);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving users: ${error.message}` });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(userId),
      },
    });
    const sanitizedUser = user ? excludePassword(user) : null;
    res.json(sanitizedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving user: ${error.message}` });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    // Handle file upload with multer
    (upload.single("profilePicture") as any)(
      req,
      res,
      async (err: Error | null) => {
        if (err) {
          console.error("Multer Error:", err);
          return res.status(400).json({
            message: "File upload error",
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }

        const {
          username,
          teamId,
          email,
          fullName,
          role = StaffRole.STAFF,
        } = req.body;
        let profilePictureUrl = "";
        // Convert uploaded file to base64 if exists
        if (req.file) {
          const filePath = req.file.path;
          const fileBuffer = fs.readFileSync(filePath);
          const base64Image = `data:${
            req.file.mimetype
          };base64,${fileBuffer.toString("base64")}`;

          // Optional: Save base64 to a specific directory or process further
          profilePictureUrl = base64Image;

          // Clean up temporary file
          fs.unlinkSync(filePath);
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });

        if (existingUser) {
          res.status(409).json({ message: "Username or email already exists" });
          return;
        }

        const randomPassword = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const newUser = await prisma.user.create({
          data: {
            userId: generateFiveDigitNumber(),
            username,
            password: hashedPassword,
            profilePictureUrl,
            teamId: Number(teamId),
            role,
            email,
            fullName,
          },
        });

        // Send password via email
        // await emailService.sendPasswordToUser(email, randomPassword);
        res.json({ message: "User Created Successfully", newUser });
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `Error retrieving users: ${error.message}` });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
