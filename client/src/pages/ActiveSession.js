import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ActiveSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionData] = useState(location.state?.sessionData || {});
  const [timeLeft, setTimeLeft] = useState(sessionData.duration * 60);
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleEndSession();
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setShowQualityDialog(true);
  };

  const handleSaveSession = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Calculate the actual duration based on how long the session ran
      const totalSeconds = sessionData.duration * 60; // Total planned seconds
      const secondsElapsed = totalSeconds - timeLeft; // How many seconds actually elapsed
      const actualDuration = Math.max(1, Math.ceil(secondsElapsed / 60)); // Convert to minutes, minimum 1 minute
      
      const sessionToSave = {
        date: new Date(),
        duration: actualDuration,
        location: sessionData.location,
        type: sessionData.type,
        energyLevel: parseInt(sessionData.energyLevel) || 3,
        quality: parseInt(quality) || 3,
        notes: notes || '',
        climbs: []
      };

      console.log('Attempting to save session with data:', sessionToSave);

      const response = await axios.post('http://localhost:5001/api/sessions', sessionToSave, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Session saved successfully:', response.data);

      // Close the quality dialog first
      setShowQualityDialog(false);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message to user
      if (error.response?.data?.missingFields) {
        alert(`Missing required fields: ${error.response.data.missingFields.join(', ')}`);
      } else {
        alert(error.response?.data?.message || 'Error saving session. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Active Session
        </Typography>
        
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="div">
            {formatTime(timeLeft)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {sessionData.location} - {sessionData.type}
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color={isPaused ? "primary" : "secondary"}
              onClick={togglePause}
              disabled={!isActive}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={handleEndSession}
              disabled={!isActive}
            >
              End Session
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Quality Rating Dialog */}
      <Dialog 
        open={showQualityDialog} 
        onClose={() => setShowQualityDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate Your Session</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography component="legend">Session Quality</Typography>
            <Rating
              value={quality}
              onChange={(event, newValue) => {
                setQuality(newValue);
              }}
              size="large"
            />
            <TextField
              label="Additional Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQualityDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSession} variant="contained" color="primary">
            Save Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ActiveSession; 