"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerError = void 0;
const handleServerError = (res, error, defaultMessage = "An unknown error occurred") => {
    console.error("Server error:", error);
    res.status(500).json({
        message: error instanceof Error ? error.message : defaultMessage,
    });
};
exports.handleServerError = handleServerError;
