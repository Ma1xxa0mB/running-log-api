const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const {
  validateStrengthSession,
  buildStrengthSessionFromBody,
} = require('../utils/strengthUtils');
const {
  getAllStrengthSessions,
  getStrengthSessionById,
  createStrengthSession,
  updateStrengthSession,
  deleteStrengthSessionById,
} = require('../data/strengthSessionStore');

function parseStrengthSessionId(rawStrengthSessionId) {
  const strengthSessionId = Number.parseInt(rawStrengthSessionId, 10);

  if (!Number.isInteger(strengthSessionId) || strengthSessionId <= 0) {
    return null;
  }

  return strengthSessionId;
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const strengthSessions = await getAllStrengthSessions(req.currentUser.id);
    res.json(strengthSessions);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch strength sessions from database',
      error: error.message,
    });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  const strengthSessionId = parseStrengthSessionId(req.params.id);

  if (!strengthSessionId) {
    return res.status(400).json({ message: 'Strength session id must be a positive integer' });
  }

  try {
    const strengthSession = await getStrengthSessionById(req.currentUser.id, strengthSessionId);

    if (!strengthSession) {
      return res.status(404).json({ message: 'Strength session not found' });
    }

    res.json(strengthSession);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch strength session from database',
      error: error.message,
    });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const validationError = validateStrengthSession(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const strengthSessionData = {
      user_id: req.currentUser.id,
      ...buildStrengthSessionFromBody(req.body),
    };

    const createdStrengthSession = await createStrengthSession(strengthSessionData);
    res.status(201).json(createdStrengthSession);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create strength session in database',
      error: error.message,
    });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const strengthSessionId = parseStrengthSessionId(req.params.id);
  const validationError = validateStrengthSession(req.body);

  if (!strengthSessionId) {
    return res.status(400).json({ message: 'Strength session id must be a positive integer' });
  }

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const strengthSessionData = buildStrengthSessionFromBody(req.body);
    const updatedStrengthSession = await updateStrengthSession(
      req.currentUser.id,
      strengthSessionId,
      strengthSessionData
    );

    if (!updatedStrengthSession) {
      return res.status(404).json({ message: 'Strength session not found' });
    }

    res.json(updatedStrengthSession);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update strength session in database',
      error: error.message,
    });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const strengthSessionId = parseStrengthSessionId(req.params.id);

  if (!strengthSessionId) {
    return res.status(400).json({ message: 'Strength session id must be a positive integer' });
  }

  try {
    const deletedStrengthSession = await deleteStrengthSessionById(
      req.currentUser.id,
      strengthSessionId
    );

    if (!deletedStrengthSession) {
      return res.status(404).json({ message: 'Strength session not found' });
    }

    res.json({
      message: 'Strength session deleted successfully',
      deletedStrengthSession,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete strength session from database',
      error: error.message,
    });
  }
});

module.exports = router;
