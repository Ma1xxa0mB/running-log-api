const { pool } = require('../db/pool');

async function getAllRuns(userId) {
  const result = await pool.query(
    'SELECT * FROM runs WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );

  return result.rows;
}

async function getRunsByType(userId, runType) {
  const result = await pool.query(
    'SELECT * FROM runs WHERE user_id = $1 AND run_type = $2 ORDER BY id ASC',
    [userId, runType]
  );

  return result.rows;
}

async function getRunById(userId, runId) {
  const result = await pool.query(
    'SELECT * FROM runs WHERE user_id = $1 AND id = $2',
    [userId, runId]
  );

  return result.rows[0] || null;
}

async function createRun(runData) {
  const result = await pool.query(
    `
      INSERT INTO runs (user_id, date, distance_km, duration_minutes, run_type, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      runData.user_id,
      runData.date,
      runData.distance_km,
      runData.duration_minutes,
      runData.run_type,
      runData.notes
    ]
  );

  return result.rows[0];
}

async function updateRun(userId, runId, runData) {
  const result = await pool.query(
    `
      UPDATE runs
      SET
        date = $1,
        distance_km = $2,
        duration_minutes = $3,
        run_type = $4,
        notes = $5,
        updated_at = NOW()
      WHERE user_id = $6 AND id = $7
      RETURNING *
    `,
    [
      runData.date,
      runData.distance_km,
      runData.duration_minutes,
      runData.run_type,
      runData.notes,
      userId,
      runId
    ]
  );

  return result.rows[0] || null;
}

async function deleteRunById(userId, runId) {
  const result = await pool.query(
    'DELETE FROM runs WHERE user_id = $1 AND id = $2 RETURNING *',
    [userId, runId]
  );

  return result.rows[0] || null;
}

async function deleteRunsByUserId(userId) {
  await pool.query(
    'DELETE FROM runs WHERE user_id = $1',
    [userId]
  );
}

module.exports = {
  getAllRuns,
  getRunsByType,
  getRunById,
  createRun,
  updateRun,
  deleteRunById,
  deleteRunsByUserId
};
