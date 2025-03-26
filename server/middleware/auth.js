const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User no longer exists');
    }

    // Check if token was issued before password change
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      throw new Error('User recently changed password. Please log in again');
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message || 'Token verification failed, authorization denied' });
  }
};

module.exports = auth; 