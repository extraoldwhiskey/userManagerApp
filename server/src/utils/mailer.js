import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export async function sendVerifyEmail(email, token) {
  const link = `http://localhost:5173/auth/verify?token=${token}`;
  try {
    await transporter.sendMail({
      from: `"My App" <mukhamedjanovjr@gmail.com>`,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hi! Click the link below to verify your email:</p>
        <a href="${link}">${link}</a>
      `,
    });
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
}
