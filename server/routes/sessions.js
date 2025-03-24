const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Session = require('../models/Session');

// Get all sessions for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .populate('climbs.climb')
            .sort({ date: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new session
router.post('/', auth, async (req, res) => {
    try {
        const session = new Session({
            ...req.body,
            user: req.user._id
        });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get a specific session
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('climbs.climb');
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a session
router.patch('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('climbs.climb');
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a session
router.delete('/:id', auth, async (req, res) => {
    try {
        const session = await Session.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 