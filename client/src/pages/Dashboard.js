import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  LocationOn as LocationIcon,
  EmojiEvents as TrophyIcon,
  PlayArrow as StartIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format, isSameDay, addMonths, subMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';


function Dashboard({ user }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    recentSessions: [],
    totalSessions: 0,
    totalTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    location: '',
    type: 'indoor',
    duration: 60,
    energyLevel: 3,
    notes: ''
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sessions = response.data;
        
        setDashboardData({
          recentSessions: sessions,
          totalSessions: sessions.length,
          totalTime: sessions.reduce((acc, session) => acc + session.duration, 0)
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartSession = () => {
    navigate('/sessions', { state: { openStartDialog: true } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
      </Container>
    );
  }

  const getSessionColor = (quality) => {
    switch(quality) {
      case 5: return '#4CAF50'; // Bright green for perfect sessions
      case 4: return '#81C784'; // Light green for great sessions
      case 3: return '#FFC107'; // Amber for average sessions
      case 2: return '#FF9800'; // Orange for below average
      case 1: return '#F44336'; // Red for poor sessions
      default: return '#444444'; // Default cell color
    }
  };

  // Update calendar data to use currentDate instead of today
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Create calendar data
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();

  // Create calendar array
  const calendar = [];
  let week = [];
  
  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(new Date(currentYear, currentMonth, day));
    
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  
  // Add remaining days to the last week if needed
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, bgcolor: '#333333' }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Welcome back, {user.name}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Here's your climbing overview
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<StartIcon />}
              onClick={handleStartSession}
              size="large"
            >
              Start Session
            </Button>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Routes</Typography>
              </Box>
              <Typography variant="h4">In progress... (track routes during session then update here)</Typography>
              <Typography color="text.secondary">
                {dashboardData.recentSessions.length} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Time</Typography>
              </Box>
              <Typography variant="h4">{Math.round(dashboardData.totalTime / 60)}h</Typography>
              <Typography color="text.secondary">
                Of total climbing time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sessions</Typography>
              </Box>
              <Typography variant="h4">{dashboardData.totalSessions}</Typography>
              <Typography color="text.secondary">
                Total climbing sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrophyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Goal</Typography>
              </Box>
              <Typography variant="h4">
                {dashboardData.recentSessions.length > 0 
                  ? Math.round((dashboardData.recentSessions.length / dashboardData.recentSessions.length) * 100) 
                  : 0}%
              </Typography>
              <Typography color="text.secondary">
                Completion rate // TODO: Add goal setting for user, place this goal here. using completion rate for now; 
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar View */}
        <Grid item xs={12}>
          <Card sx={{ 
            boxShadow: 'none', 
            bgcolor: '#333333',
            color: 'white',
            border: 'none'
          }}>
            <CardHeader 
              title="Climbing Calendar" 
              sx={{ color: 'white' }}
              align="center"
            />
            <CardContent>
              <Box sx={{ mb: 2, maxWidth: '800px', margin: '0 auto' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <IconButton 
                    onClick={handlePreviousMonth}
                    sx={{ color: 'white' }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {format(currentDate, 'MMMM yyyy')}
                  </Typography>
                  <IconButton 
                    onClick={handleNextMonth}
                    sx={{ color: 'white' }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={0} sx={{ width: '100%' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Grid item xs={12/7} key={day} sx={{ textAlign: 'center', mb: 0.5 }}>
                      <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={0} sx={{ width: '100%' }}>
                  {calendar.map((week, weekIndex) => (
                    <React.Fragment key={weekIndex}>
                      {week.map((date, dayIndex) => (
                        <Grid item xs={12/7} key={`${weekIndex}-${dayIndex}`}>
                          <Box
                            sx={{
                              pt: '70%',
                              position: 'relative',
                              bgcolor: 'transparent'
                            }}
                          >
                            {date && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: (() => {
                                    const session = dashboardData.recentSessions.find(
                                      s => isSameDay(new Date(s.date), date)
                                    );
                                    return session ? getSessionColor(session.quality) : '#444444';
                                  })(),
                                  borderRadius: 1,
                                  m: 0.5,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    filter: 'brightness(1.2)'
                                  }
                                }}
                              >
                                <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                  {format(date, 'd')}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Sessions */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#333333', color: 'white', boxShadow: 'none' }}>
            <CardHeader 
              title="Recent Sessions" 
              sx={{
                '& .MuiCardHeader-title': {
                  color: 'white'
                }
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {dashboardData.recentSessions.map((session, index) => (
                  <Grid item xs={12} sm={6} md={4} key={session._id || index}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: '#444444',
                      color: 'white'
                    }}>
                      <Typography variant="h6">
                        {format(new Date(session.date), 'MMM d, yyyy')}
                      </Typography>
                      <Typography color="text.secondary">
                        {session.location}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: getSessionColor(session.quality)
                          }}
                        />
                        <Typography variant="body2">
                          Quality: {session.quality}/5
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Duration: {session.duration} minutes
                      </Typography>
                      <Typography variant="body2">
                        Type: {session.type}
                      </Typography>
                      <Typography variant="body2">
                        Energy Level: {session.energyLevel}/5
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Start Session Dialog */}
      <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)}>
        <DialogTitle>Start New Climbing Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={newSession.location}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="type"
            label="Type"
            select
            fullWidth
            value={newSession.type}
            onChange={handleChange}
          >
            <MenuItem value="indoor">Indoor</MenuItem>
            <MenuItem value="outdoor">Outdoor</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="duration"
            label="Duration (minutes)"
            type="number"
            fullWidth
            value={newSession.duration}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="energyLevel"
            label="Energy Level"
            select
            fullWidth
            value={newSession.energyLevel}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newSession.notes}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSessionDialog(false)}>Cancel</Button>
          <Button onClick={handleStartSession} variant="contained" color="primary">
            Start Session
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard; 