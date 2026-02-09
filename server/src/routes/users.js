import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log(req);
  try {
    const { rows } = await pool.query(
      `SELECT id, username, email, status, last_login, version FROM users`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/block", async (req, res) => {
  const { ids, versions } = req.body;

  const result = await pool.query(
    `UPDATE users 
     SET previous_status = status, 
     status = 'blocked', 
     version = version + 1
     WHERE id = ANY($1) AND status != 'blocked' AND version = ANY($2)`,
    [ids, versions],
  );
  
  if (result.rowCount !== ids.length) {
    return res.status(409).json({ message: "Some users were already modified. Please refresh the page." });
  }

  const { rows } = await pool.query(
    `SELECT status FROM users WHERE id = $1`,
    [req.user.id],
  );

  if (rows[0].status === 'blocked') {
    return res.status(200).json({ redirect: "/login" });
  }
  res.json({ ok: true });
});

router.post("/unblock", async (req, res) => {
  const { ids, versions } = req.body;
  const result = await pool.query(
    `UPDATE users 
     SET status = previous_status,
      previous_status = NULL,
      version = version + 1
     WHERE id = ANY($1) AND status = 'blocked' AND version = ANY($2)`,
    [ids, versions],
  );
  if (result.rowCount !== ids.length) {
    return res.status(409).json({ message: "Some users were already modified. Please refresh the page." });
  }
  res.json({ ok: true });
});

router.delete("/", async (req, res) => {
  const { ids, versions } = req.body;
  const currentUserId = req.user.id;
  const deletingSelf = ids.includes(currentUserId);
  const result = await pool.query(`DELETE FROM users WHERE id = ANY($1) AND version = ANY($2)`, [ids, versions]);
  if (result.rowCount !== ids.length) {return res.status(409).json({ message: "Some users were already modified. Please refresh the page." });}
  if (deletingSelf) {return res.status(200).json({ redirect: "/login" });}
  res.json({ ok: true });
});

router.delete("/unverified", async (_, res) => {
  await pool.query(`DELETE FROM users WHERE status = 'unverified'`);
  res.json({ ok: true });
});

export default router;
