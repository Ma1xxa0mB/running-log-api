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
      INSERT INTO runs (
        user_id,
        date,
        distance_km,
        duration_seconds,
        elevation_m,
        run_type,
        run_label,
        avg_pace_min_km,
        avg_hr,
        max_hr,
        avg_temperature_c,
        surface,
        zone_1_seconds,
        zone_2_seconds,
        zone_3_seconds,
        zone_4_seconds,
        zone_5_seconds
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `,
    [
      runData.user_id,
      runData.date,
      runData.distance_km,
      runData.duration_seconds,
      runData.elevation_m,
      runData.run_type,
      runData.run_label,
      runData.avg_pace_min_km,
      runData.avg_hr,
      runData.max_hr,
      runData.avg_temperature_c,
      runData.surface,
      runData.zone_1_seconds,
      runData.zone_2_seconds,
      runData.zone_3_seconds,
      runData.zone_4_seconds,
      runData.zone_5_seconds
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
        duration_seconds = $3,
        elevation_m = $4,
        run_type = $5,
        run_label = $6,
        avg_pace_min_km = $7,
        avg_hr = $8,
        max_hr = $9,
        avg_temperature_c = $10,
        surface = $11,
        zone_1_seconds = $12,
        zone_2_seconds = $13,
        zone_3_seconds = $14,
        zone_4_seconds = $15,
        zone_5_seconds = $16,
        updated_at = NOW()
      WHERE user_id = $17 AND id = $18
      RETURNING *
    `,
    [
      runData.date,
      runData.distance_km,
      runData.duration_seconds,
      runData.elevation_m,
      runData.run_type,
      runData.run_label,
      runData.avg_pace_min_km,
      runData.avg_hr,
      runData.max_hr,
      runData.avg_temperature_c,
      runData.surface,
      runData.zone_1_seconds,
      runData.zone_2_seconds,
      runData.zone_3_seconds,
      runData.zone_4_seconds,
      runData.zone_5_seconds,
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
