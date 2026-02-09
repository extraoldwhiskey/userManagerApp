import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SENDER_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
});

export async function sendVerifyEmail(email, token) {
  const link = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`
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
