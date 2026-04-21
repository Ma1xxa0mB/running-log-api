const { pool } = require('../db/pool');

async function getAllStrengthSessions(userId) {
  const result = await pool.query(
    'SELECT * FROM strength_sessions WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );

  return result.rows;
}

async function getStrengthSessionById(userId, strengthSessionId) {
  const result = await pool.query(
    'SELECT * FROM strength_sessions WHERE user_id = $1 AND id = $2',
    [userId, strengthSessionId]
  );

  return result.rows[0] || null;
}

async function createStrengthSession(strengthSessionData) {
  const result = await pool.query(
    `
      INSERT INTO strength_sessions (
        user_id,
        date,
        duration_seconds
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [
      strengthSessionData.user_id,
      strengthSessionData.date,
      strengthSessionData.duration_seconds,
    ]
  );

  return result.rows[0];
}

async function updateStrengthSession(userId, strengthSessionId, strengthSessionData) {
  const result = await pool.query(
    `
      UPDATE strength_sessions
      SET
        date = $1,
        duration_seconds = $2,
        updated_at = NOW()
      WHERE user_id = $3 AND id = $4
      RETURNING *
    `,
    [
      strengthSessionData.date,
      strengthSessionData.duration_seconds,
      userId,
      strengthSessionId,
    ]
  );

  return result.rows[0] || null;
}

async function deleteStrengthSessionById(userId, strengthSessionId) {
  const result = await pool.query(
    'DELETE FROM strength_sessions WHERE user_id = $1 AND id = $2 RETURNING *',
    [userId, strengthSessionId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getAllStrengthSessions,
  getStrengthSessionById,
  createStrengthSession,
  updateStrengthSession,
  deleteStrengthSessionById,
};
