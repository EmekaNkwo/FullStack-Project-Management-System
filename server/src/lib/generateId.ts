import crypto from "crypto";
export function generateFiveDigitNumber(): number {
  const timestamp = Date.now() % 100000;
  const randomPart = Math.floor(Math.random() * 90000) + 10000;
  return parseInt(
    ((timestamp + randomPart) % 100000).toString().padStart(5, "0")
  );
}

export const generateRandomPassword = (length: number = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const randomBytes = crypto.randomBytes(length);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
};

export const excludePassword = <T extends { password?: string | null }>(
  user: T
): Omit<T, "password"> => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
