import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import auth from "../middleware/auth.js";
import { sendVerifyEmail } from "../utils/mailer.js";

const router = express.Router();

function generateVerifyToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const UUID = crypto.randomUUID();
    const loginTime = new Date().toLocaleString("ru-RU");
    const hash = await bcrypt.hash(password, 10);
    const { token, tokenHash } = generateVerifyToken();

    await pool.query(
      `INSERT INTO users(
        uuid, username, email, password_hash, last_login, status, verify_token, verify_token_expires
      ) VALUES($1,$2,$3,$4,$5,$6,$7, now() + interval '24 hours')`,
      [UUID, name, email, hash, loginTime, "unverified", tokenHash],
    );

    res.json({ message: "Registration successful" });
    sendVerifyEmail(email, token).catch((err) =>
      console.error("Email error:", err),
    );
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Duplicate entry caught: this UUID is already in use" });
    }
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
});

router.get("/me", auth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT username, email, status, created_at FROM users WHERE id = $1`,
    [req.user.id],
  );
  res.json(rows[0]);
});

router.get("/verify", async (req, res) => {
  const { token } = req.query;
  if (!token)
    return res.json({ message: "The token is invalid or has expired" });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const { rowCount } = await pool.query(
      `
      UPDATE users
      SET status='active', verify_token=NULL, verify_token_expires=NULL
      WHERE verify_token=$1 AND verify_token_expires>now() AND status='unverified'
    `,
      [tokenHash],
    );
    if (!rowCount) {
      return res.json({ message: "The token is invalid or has expired" });
    }

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT id, username, email, password_hash, status, created_at FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password, please try again",
      });
    }

    if (user.status === "blocked") {
      return res.status(401).json({
        message: "Sorry, your account has been blocked",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error during login",
    });
  }
});

export default router;
