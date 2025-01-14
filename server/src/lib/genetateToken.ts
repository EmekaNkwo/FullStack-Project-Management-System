import jwt from "jsonwebtoken";
export const generateToken = (userId: number, email: string) =>
  jwt.sign({ userId, email }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "1h",
  });
