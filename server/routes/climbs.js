const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Climb = require('../models/Climb');

// Get all climbs for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const climbs = await Climb.find({ user: req.user._id });
        res.json(climbs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new climb
router.post('/', auth, async (req, res) => {
    try {
        const climb = new Climb({
            ...req.body,
            user: req.user._id
        });
        await climb.save();
        res.status(201).json(climb);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get a specific climb
router.get('/:id', auth, async (req, res) => {
    try {
        const climb = await Climb.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!climb) {
            return res.status(404).json({ message: 'Climb not found' });
        }
        
        res.json(climb);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a climb
router.patch('/:id', auth, async (req, res) => {
    try {
        const climb = await Climb.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!climb) {
            return res.status(404).json({ message: 'Climb not found' });
        }
        
        res.json(climb);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a climb
router.delete('/:id', auth, async (req, res) => {
    try {
        const climb = await Climb.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        
        if (!climb) {
            return res.status(404).json({ message: 'Climb not found' });
        }
        
        res.json({ message: 'Climb deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 