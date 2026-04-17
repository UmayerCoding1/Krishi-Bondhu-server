"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../../.env" });
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    throw new Error("Email credentials missing in .env");
}
console.log(process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS);
const transporter = nodemailer_1.default.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    pool: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});
const sendEmail = async (to, sub, otp) => {
    await transporter.sendMail({
        from: `"কৃষি বন্ধু " <${process.env.NODEMAILER_USER}>`,
        to,
        subject: sub,
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <h2 style="text-align: center; color: #1e293b; margin-bottom: 20px;">
            Verify Your Email Address
          </h2>

          <p style="font-size: 16px; color: #475569; line-height: 1.6;">
            Thank you for registering with <strong>কৃষি বন্ধু</strong>.
            Please use the OTP below to verify your email address.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              background-color: #2563eb;
              color: #ffffff;
              padding: 14px 28px;
              font-size: 24px;
              letter-spacing: 4px;
              font-weight: bold;
              border-radius: 8px;
            ">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #64748b; text-align: center;">
            This OTP will expire in 10 minutes.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            If you did not request this email, please ignore it.
          </p>

          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            © ${new Date().getFullYear()} কৃষি বন্ধু. All rights reserved.
          </p>

        </div>
      </div>
    `,
    });
    return { success: true };
};
exports.sendEmail = sendEmail;
