const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../data/userStore');
const { deleteRunsByUserId } = require('../data/runStore');
const { requireAuth } = require('../middleware/requireAuth');
const { deleteSession } = require('../data/sessionStore');
const { parseCookies } = require('../utils/sessionUtils');
const {
  validateUser,
  validateUserUpdate,
  buildUserFromBody,
  buildUserUpdateFromBody,
  buildUserResponse
} = require('../utils/userUtils');

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.currentUser.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(buildUserResponse(user));
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch user from database',
      error: error.message
    });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  const validationError = validateUserUpdate(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const userData = buildUserUpdateFromBody(req.body);
    const updatedUser = await updateUserById(req.currentUser.id, userData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(buildUserResponse(updatedUser));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'username or email already exists'
      });
    }

    return res.status(500).json({
      message: 'Failed to update user in database',
      error: error.message
    });
  }
});

router.delete('/me', requireAuth, async (req, res) => {
  try {
    await deleteRunsByUserId(req.currentUser.id);
    const deletedUser = await deleteUserById(req.currentUser.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cookies = parseCookies(req.header('cookie'));

    if (cookies.sid) {
      await deleteSession(cookies.sid);
    }

    res.setHeader('Set-Cookie', 'sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete user from database',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  const validationError = validateUser(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const userData = buildUserFromBody(req.body);
    const newUser = await createUser(userData);

    res.status(201).json(buildUserResponse(newUser));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'username or email already exists'
      });
    }

    res.status(500).json({
      message: 'Failed to create user in database',
      error: error.message
    });
  }
});

module.exports = router;
