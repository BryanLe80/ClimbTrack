const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Climb = require('../models/Climb');

// @route   GET /api/climbs
// @desc    Get all climbs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const climbs = await Climb.find({ user: req.user._id });
    res.json(climbs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/climbs
// @desc    Create a new climb
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, difficulty, location, notes } = req.body;
    const climb = new Climb({
      name,
      type,
      difficulty,
      location,
      notes,
      user: req.user._id,
    });
    await climb.save();
    res.status(201).json(climb);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/climbs/:id
// @desc    Update a climb
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const climb = await Climb.findById(req.params.id);
    if (!climb) {
      return res.status(404).json({ message: 'Climb not found' });
    }

    // Check if user owns the climb
    if (climb.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedClimb = await Climb.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClimb);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/climbs/:id
// @desc    Delete a climb
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const climb = await Climb.findById(req.params.id);
    if (!climb) {
      return res.status(404).json({ message: 'Climb not found' });
    }

    // Check if user owns the climb
    if (climb.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await climb.remove();
    res.json({ message: 'Climb removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 