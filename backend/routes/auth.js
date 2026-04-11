const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../data/userStore');
const { createSession, deleteSession } = require('../data/sessionStore');
const {
  validateLogin,
  hashPassword,
  buildUserResponse
} = require('../utils/userUtils');
const { buildSessionCookie, parseCookies } = require('../utils/sessionUtils');

router.post('/login', async (req, res) => {
  const validationError = validateLogin(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const user = await getUserByEmail(req.body.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const hashedPassword = hashPassword(req.body.password);

    if (hashedPassword !== user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sessionId = await createSession(user.id);
    res.setHeader('Set-Cookie', buildSessionCookie(sessionId));

    return res.status(200).json({
      message: 'Login successful',
      user: buildUserResponse(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to login',
      error: error.message
    });
  }
});

router.post('/logout', async (req, res) => {
  const cookies = parseCookies(req.header('cookie'));

  if (cookies.sid) {
    await deleteSession(cookies.sid);
  }

  res.setHeader('Set-Cookie', 'sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
