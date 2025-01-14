import nodemailer from "nodemailer";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email service class
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter from environment variables
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  // Send password to new user
  async sendPasswordToUser(email: string, password: string): Promise<void> {
    try {
      await this.transporter.sendMail({
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
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send password email");
    }
  }
}

export default new EmailService();
