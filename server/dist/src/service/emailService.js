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
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email service class
class EmailService {
    constructor() {
        // Configure email transporter from environment variables
        const config = {
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || "",
                pass: process.env.SMTP_PASS || "",
            },
        };
        this.transporter = nodemailer_1.default.createTransport(config);
    }
    // Send password to new user
    sendPasswordToUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail({
                    from: `"Project Management App" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: "Your New Account Password",
                    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Project Management App</h2>
            <p>Your account has been created. Here are your login credentials:</p>
            <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> <code>${password}</code></p>
            </div>
            <p>Please log in and change your password immediately.</p>
            <p>If you did not create this account, please contact support.</p>
          </div>
        `,
                    text: `
          Welcome to Project Management App
          
          Your account has been created.
          
          Email: ${email}
          Temporary Password: ${password}
          
          Please log in and change your password immediately.
          If you did not create this account, please contact support.
        `,
                });
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw new Error("Failed to send password email");
            }
        });
    }
}
exports.default = new EmailService();
