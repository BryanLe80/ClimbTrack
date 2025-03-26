@echo off
echo Starting development environment...

REM Kill any existing Node.js processes
taskkill /F /FI "IMAGENAME eq node.exe" > nul 2>&1

REM Start the server
start "ClimbTrack Server" cmd /k "cd server && npm run dev"

REM Wait a moment
timeout /t 2 /nobreak > nul

REM Start the client
start "ClimbTrack Client" cmd /k "cd client && npm start"

echo.
echo Development environment is starting...
echo.
echo Client: http://localhost:3000
echo Server: http://localhost:5001 