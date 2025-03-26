const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's routes
    const routes = user.routes;
    const totalRoutes = routes.length;
    const completedRoutes = routes.filter(route => route.completed).length;

    // Get user's sessions
    const sessions = user.sessions
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
    
    const totalSessions = user.sessions.length;
    const totalTime = sessions.reduce((acc, session) => acc + session.duration, 0);

    // Get recent routes
    const recentRoutes = routes
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    res.json({
      totalRoutes,
      completedRoutes,
      totalSessions,
      totalTime,
      recentRoutes,
      recentSessions: sessions
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router; 