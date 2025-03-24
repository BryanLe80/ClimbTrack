# ClimbTrack - Rock Climbing Workout Tracker

A full-stack application for tracking rock climbing workouts, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication
- Track climbing sessions
- Log routes/problems with difficulty ratings
- Track climbing metrics (duration, attempts, etc.)
- View climbing history and statistics
- Responsive design for mobile and desktop

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT

## Project Structure

```
climbtrack/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
5. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
6. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
