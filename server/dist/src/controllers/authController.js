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
exports.signOut = exports.getLoggedInUser = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateId_1 = require("../lib/generateId");
const handleServerError_1 = require("../lib/handleServerError");
const genetateToken_1 = require("../lib/genetateToken");
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName } = req.body;
        const existingUser = yield prisma.user.findUnique({
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                userId: (0, generateId_1.generateFiveDigitNumber)(),
                email,
                password: hashedPassword,
                fullName,
                role: "STAFF", // Default role
                teamId: null, // Optional team assignment
                username: email.split("@")[0], // Generate username from email
            },
        });
        const sanitizedUser = (0, generateId_1.excludePassword)(user);
        // Generate token
        const token = (0, genetateToken_1.generateToken)(user.userId, user.email);
        res.status(201).json({
            message: "User registered successfully",
            user: sanitizedUser,
            token,
        });
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        // Find user
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Check password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password || "");
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Generate JWT token
        const token = (0, genetateToken_1.generateToken)(user.userId, user.email);
        res.json({
            message: "Login successful",
            token,
            user: (0, generateId_1.excludePassword)(user),
        });
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error, "Error during login");
    }
});
exports.login = login;
const getLoggedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure req.user exists and has userId
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { userId: req.user.userId },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const sanitizedUser = (0, generateId_1.excludePassword)(user);
        res.json(sanitizedUser);
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error, "Error retrieving user");
    }
});
exports.getLoggedInUser = getLoggedInUser;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Sign out successful" });
    }
    catch (error) {
        (0, handleServerError_1.handleServerError)(res, error, "Error signing out");
    }
});
exports.signOut = signOut;
