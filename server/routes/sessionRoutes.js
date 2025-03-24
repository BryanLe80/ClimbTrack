const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all sessions for the authenticated user
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// Create a new session
router.post('/', async (req, res) => {
  try {
    const session = new Session({
      ...req.body,
      user: req.user.userId
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session' });
  }
});

// Update a session
router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session' });
  }
});

// Delete a session
router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
});

module.exports = router; 