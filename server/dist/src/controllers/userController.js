"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = exports.getUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateId_1 = require("../lib/generateId");
const prisma = new client_1.PrismaClient();
// const upload = multer({ dest: "uploads/" });
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, "../uploads");
        // Ensure upload directory exists
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
};
// Multer upload configuration
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        const sanitizedUsers = users.map(generateId_1.excludePassword);
        res.json(sanitizedUsers);
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ message: `Error retrieving users: ${error.message}` });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                userId: Number(userId),
            },
        });
        const sanitizedUser = user ? (0, generateId_1.excludePassword)(user) : null;
        res.json(sanitizedUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ message: `Error retrieving user: ${error.message}` });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.getUser = getUser;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle file upload with multer
        upload.single("profilePicture")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Multer Error:", err);
                return res.status(400).json({
                    message: "File upload error",
                    error: err instanceof Error ? err.message : "Unknown error",
                });
            }
            const { username, teamId, email, fullName, role = client_1.StaffRole.STAFF, } = req.body;
            let profilePictureUrl = "";
            // Convert uploaded file to base64 if exists
            if (req.file) {
                const filePath = req.file.path;
                const fileBuffer = fs_1.default.readFileSync(filePath);
                const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`;
                // Optional: Save base64 to a specific directory or process further
                profilePictureUrl = base64Image;
                // Clean up temporary file
                fs_1.default.unlinkSync(filePath);
            }
            const existingUser = yield prisma.user.findFirst({
                where: {
                    OR: [{ username }, { email }],
                },
            });
            if (existingUser) {
                res.status(409).json({ message: "Username or email already exists" });
                return;
            }
            const randomPassword = (0, generateId_1.generateRandomPassword)();
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(randomPassword, salt);
            const newUser = yield prisma.user.create({
                data: {
                    userId: (0, generateId_1.generateFiveDigitNumber)(),
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
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ message: `Error retrieving users: ${error.message}` });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.postUser = postUser;
