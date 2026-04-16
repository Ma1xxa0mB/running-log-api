const { pool } = require('../db/pool');

async function createUser(userData) {
  const result = await pool.query(
    `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [userData.username, userData.email, userData.password_hash]
  );

  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
}

async function getUserById(userId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0] || null;
}

async function updateUserById(userId, userData) {
  const result = await pool.query(
    `
      UPDATE users
      SET
        username = $1,
        email = $2,
        hr_rest = $3,
        hr_max = $4
      WHERE id = $5
      RETURNING *
    `,
    [userData.username, userData.email, userData.hr_rest, userData.hr_max, userId]
  );

  return result.rows[0] || null;
}

async function deleteUserById(userId) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById
};
