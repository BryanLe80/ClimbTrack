const mongoose = require('mongoose');
const User = require('./models/User');
const Session = require('./models/Session');

const testSessions = [
  { 
    date: '2024-03-05T10:00:00.000Z', 
    duration: 120, 
    location: 'Boulder Gym', 
    type: 'indoor', 
    energyLevel: 4,
    quality: 4,
    notes: 'Great session, worked on overhangs'
  },
  { 
    date: '2024-03-12T15:30:00.000Z', 
    duration: 90, 
    location: 'Rock Wall', 
    type: 'indoor', 
    energyLevel: 5,
    quality: 5,
    notes: 'Sent my project!'
  },
  { 
    date: '2024-03-15T14:00:00.000Z', 
    duration: 150, 
    location: 'Climbing Center', 
    type: 'indoor', 
    energyLevel: 3,
    quality: 3,
    notes: 'Focused on technique'
  },
  { 
    date: '2024-03-20T11:00:00.000Z', 
    duration: 60, 
    location: 'Boulder Gym', 
    type: 'indoor', 
    energyLevel: 4,
    quality: 2,
    notes: 'Feeling a bit tired'
  }
];

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/climbtrack');
    console.log('Connected to MongoDB');

    // Drop the entire database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped');

    // Recreate the users collection and add root user
    await User.create({
      email: 'root@example.com',
      password: 'root',
      name: 'root',
      dateOfBirth: new Date('1990-01-01')
    });
    console.log('Root user recreated');

    // Find the newly created root user
    const rootUser = await User.findOne({ email: 'root@example.com' });
    console.log('Found root user:', rootUser.email);

    // Add test sessions for root user
    const sessionsWithUser = testSessions.map(session => ({
      ...session,
      user: rootUser._id,
      climbs: []
    }));

    const result = await Session.insertMany(sessionsWithUser);
    console.log(`Added ${result.length} test sessions for root user`);

    // Verify sessions were added
    const addedSessions = await Session.find({ user: rootUser._id }).sort({ date: 1 });
    console.log('Sessions in database:', addedSessions.length);
    addedSessions.forEach(session => {
      console.log(`- ${new Date(session.date).toLocaleString()}: ${session.location} (Quality: ${session.quality})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetDatabase(); 