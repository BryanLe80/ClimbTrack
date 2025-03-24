const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all routes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find({ user: req.user.userId });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes' });
  }
});

// Create a new route
router.post('/', async (req, res) => {
  try {
    const route = new Route({
      ...req.body,
      user: req.user.userId
    });
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error creating route' });
  }
});

// Update a route
router.put('/:id', async (req, res) => {
  try {
    const route = await Route.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error updating route' });
  }
});

// Delete a route
router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route' });
  }
});

module.exports = router; 