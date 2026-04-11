const express = require('express');
const router = express.Router();
const {
  validateRun,
  buildRunFromBody
} = require('../utils/runUtils');
const { requireAuth } = require('../middleware/requireAuth');
const {
  getAllRuns,
  getRunsByType,
  getRunById,
  createRun,
  updateRun,
  deleteRunById
} = require('../data/runStore');

function parseRunId(rawRunId) {
  const runId = Number.parseInt(rawRunId, 10);

  if (!Number.isInteger(runId) || runId <= 0) {
    return null;
  }

  return runId;
}

// Get my runs and optionally filter by type
router.get('/', requireAuth, async (req, res) => {
  const runType = req.query.run_type;

  try {
    if (!runType) {
      const runs = await getAllRuns(req.currentUser.id);
      return res.json(runs);
    }

    const filteredRuns = await getRunsByType(req.currentUser.id, runType);
    res.json(filteredRuns);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch runs from database',
      error: error.message
    });
  }
});

// Get one of my runs by ID
router.get("/:id", requireAuth, async (req, res) => {
  const runId = parseRunId(req.params.id);

  if (!runId) {
    return res.status(400).json({ message: 'Run id must be a positive integer' });
  }

  try {
    const run = await getRunById(req.currentUser.id, runId);

    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }

    res.json(run);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch run from database',
      error: error.message
    });
  }
});

// Create one of my runs
router.post('/', requireAuth, async (req, res) => {
  const validationError = validateRun(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const runData = {
      user_id: req.currentUser.id,
      ...buildRunFromBody(req.body)
    };
    const newRun = await createRun(runData);

    res.status(201).json(newRun);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create run in database',
      error: error.message
    });
  }
});

// Update one of my runs by ID
router.put("/:id", requireAuth, async (req, res) => {
  const runId = parseRunId(req.params.id);
  const validationError = validateRun(req.body);

  if (!runId) {
    return res.status(400).json({ message: 'Run id must be a positive integer' });
  }

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const runData = buildRunFromBody(req.body);
    const updatedRun = await updateRun(req.currentUser.id, runId, runData);

    if (!updatedRun) {
      return res.status(404).json({ message: 'Run not found' });
    }

    res.json(updatedRun);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update run in database',
      error: error.message
    });
  }
});

// Delete one of my runs by ID
router.delete("/:id", requireAuth, async (req, res) => {
  const runId = parseRunId(req.params.id);

  if (!runId) {
    return res.status(400).json({ message: 'Run id must be a positive integer' });
  }

  try {
    const deletedRun = await deleteRunById(req.currentUser.id, runId);

    if (!deletedRun) {
      return res.status(404).json({ message: 'Run not found' });
    }

    res.json({
      message: 'Run deleted successfully',
      deletedRun: deletedRun
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete run from database',
      error: error.message
    });
  }
});

module.exports = router;
