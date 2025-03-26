const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testSessions = [
  {
    date: new Date('2024-03-05T10:00:00.000Z'),
    duration: 120,
    location: 'Boulder Gym',
    type: 'indoor',
    energyLevel: 4,
    quality: 4,
    notes: 'Great session, worked on overhangs',
    climbs: [],
    createdAt: new Date('2025-03-24T19:20:50.411Z'),
    updatedAt: new Date('2025-03-24T19:20:50.413Z')
  },
  {
    date: new Date('2024-03-08T14:30:00.000Z'),
    duration: 90,
    location: 'Red Rock Canyon',
    type: 'outdoor',
    energyLevel: 5,
    quality: 5,
    notes: 'Perfect weather, sent a new 5.10a',
    climbs: [],
    createdAt: new Date('2025-03-24T19:20:50.411Z'),
    updatedAt: new Date('2025-03-24T19:20:50.413Z')
  },
  {
    date: new Date('2024-03-12T09:00:00.000Z'),
    duration: 150,
    location: 'Climbing Works',
    type: 'indoor',
    energyLevel: 3,
    quality: 3,
    notes: 'Tired from work, focused on technique',
    climbs: [],
    createdAt: new Date('2025-03-24T19:20:50.411Z'),
    updatedAt: new Date('2025-03-24T19:20:50.413Z')
  },
  {
    date: new Date('2024-03-15T11:00:00.000Z'),
    duration: 180,
    location: 'Yosemite Valley',
    type: 'outdoor',
    energyLevel: 5,
    quality: 5,
    notes: 'Multi-pitch day, climbed El Capitan',
    climbs: [],
    createdAt: new Date('2025-03-24T19:20:50.411Z'),
    updatedAt: new Date('2025-03-24T19:20:50.413Z')
  },
  {
    date: new Date('2024-03-20T16:00:00.000Z'),
    duration: 60,
    location: 'The Spot',
    type: 'indoor',
    energyLevel: 4,
    quality: 4,
    notes: 'Quick bouldering session after work',
    climbs: [],
    createdAt: new Date('2025-03-24T19:20:50.411Z'),
    updatedAt: new Date('2025-03-24T19:20:50.413Z')
  }
];

async function addTestSessions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the root user
    const rootUser = await User.findOne({ email: 'root@example.com' });
    if (!rootUser) {
      console.log('Root user not found');
      return;
    }

    // Clear existing sessions
    rootUser.sessions = [];

    // Add all test sessions
    rootUser.sessions.push(...testSessions);
    await rootUser.save();

    console.log('Test sessions added successfully');
    console.log('Root user sessions:', rootUser.sessions);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

addTestSessions(); 