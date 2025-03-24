const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    // Get user's routes
    const routes = await Route.find({ user: req.user.userId });
    const totalRoutes = routes.length;
    const completedRoutes = routes.filter(route => route.completed).length;

    // Get user's sessions
    const sessions = await Session.find({ user: req.user.userId })
      .sort({ date: -1 })
      .limit(5);
    
    const totalSessions = await Session.countDocuments({ user: req.user.userId });
    const totalTime = sessions.reduce((acc, session) => acc + session.duration, 0);

    // Get recent routes
    const recentRoutes = await Route.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(5);

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