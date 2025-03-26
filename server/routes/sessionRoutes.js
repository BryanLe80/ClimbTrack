const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all sessions for the authenticated user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// Create a new session
router.post('/', async (req, res) => {
  try {
    console.log('Creating new session with data:', req.body); // Debug log
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found:', req.user.userId); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate required fields
    const requiredFields = ['date', 'duration', 'location', 'type', 'energyLevel', 'quality'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields); // Debug log
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
    }
    
    user.sessions.push(req.body);
    await user.save();
    
    const newSession = user.sessions[user.sessions.length - 1];
    console.log('Session created successfully:', newSession); // Debug log
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error); // Detailed error log
    res.status(500).json({ 
      message: 'Error creating session',
      error: error.message 
    });
  }
});

// Update a session
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sessionIndex = user.sessions.findIndex(
      session => session._id.toString() === req.params.id
    );

    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update the session
    user.sessions[sessionIndex] = {
      ...user.sessions[sessionIndex].toObject(),
      ...req.body,
      _id: user.sessions[sessionIndex]._id // Preserve the original _id
    };

    await user.save();
    res.json(user.sessions[sessionIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session' });
  }
});

// Delete a session
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sessionIndex = user.sessions.findIndex(
      session => session._id.toString() === req.params.id
    );

    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Remove the session
    user.sessions.splice(sessionIndex, 1);
    await user.save();

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
});

module.exports = router; 