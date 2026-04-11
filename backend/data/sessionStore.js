const crypto = require('crypto');
const { pool } = require('../db/pool');

async function ensureSessionsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function createSession(userId) {
  const sessionId = crypto.randomBytes(24).toString('hex');
  await pool.query(
    'INSERT INTO sessions (id, user_id) VALUES ($1, $2)',
    [sessionId, userId]
  );
  return sessionId;
}

async function getSession(sessionId) {
  const result = await pool.query(
    'SELECT * FROM sessions WHERE id = $1',
    [sessionId]
  );

  return result.rows[0] || null;
}

async function deleteSession(sessionId) {
  await pool.query(
    'DELETE FROM sessions WHERE id = $1',
    [sessionId]
  );
}

module.exports = {
  ensureSessionsTable,
  createSession,
  getSession,
  deleteSession
};
