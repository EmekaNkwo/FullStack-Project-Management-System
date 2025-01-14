import { Response } from "express";
export const handleServerError = (
  res: Response,
  error: unknown,
  defaultMessage = "An unknown error occurred"
) => {
  console.error("Server error:", error);
  res.status(500).json({
    message: error instanceof Error ? error.message : defaultMessage,
  });
};
