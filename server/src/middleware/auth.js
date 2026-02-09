import jwt from 'jsonwebtoken'
import pool from '../db/index.js'

export default async function auth(req, res, next) {
  console.log('Authorization middleware hit');
  const header = req.headers.authorization
  
  if (!header) return res.status(401).json({ message: 'Session expired. Please login again.' });
  
  const token = header.split(' ')[1]
  
  try {
    console.log('Verifying token...');
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded JWT:", payload);
    const { rows } = await pool.query(
      `SELECT id, status FROM users WHERE id = $1`,
      [payload.id]
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'User not found' })
    }

    const user = rows[0]

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'User is blocked' })
    }

    req.user = user
    next()

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
