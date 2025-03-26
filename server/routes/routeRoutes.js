const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all routes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes' });
  }
});

// Create a new route
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.routes.push(req.body);
    await user.save();
    
    const newRoute = user.routes[user.routes.length - 1];
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating route' });
  }
});

// Update a route
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const routeIndex = user.routes.findIndex(
      route => route._id.toString() === req.params.id
    );

    if (routeIndex === -1) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Update the route
    user.routes[routeIndex] = {
      ...user.routes[routeIndex].toObject(),
      ...req.body,
      _id: user.routes[routeIndex]._id // Preserve the original _id
    };

    await user.save();
    res.json(user.routes[routeIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating route' });
  }
});

// Delete a route
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const routeIndex = user.routes.findIndex(
      route => route._id.toString() === req.params.id
    );

    if (routeIndex === -1) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Remove the route
    user.routes.splice(routeIndex, 1);
    await user.save();

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route' });
  }
});

module.exports = router; 