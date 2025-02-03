"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    var _a;
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = Array.isArray(authHeader)
        ? (_a = authHeader[0]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]
        : authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateToken = authenticateToken;
