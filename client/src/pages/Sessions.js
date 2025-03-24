import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';



function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to load sessions');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleEditClick = (session) => {
    setEditingSession(session);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditingSession(null);
    setEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/sessions/${editingSession._id}`, editingSession, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the sessions list
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session._id === editingSession._id ? editingSession : session
        )
      );

      handleEditClose();
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session');
    }
  };

  const getQualityColor = (quality) => {
    switch(quality) {
      case 5: return '#4CAF50';
      case 4: return '#81C784';
      case 3: return '#FFC107';
      case 2: return '#FF9800';
      case 1: return '#F44336';
      default: return '#444444';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Climbing Sessions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Energy Level</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(session.date), 'PPp')}</TableCell>
                <TableCell>{session.location}</TableCell>
                <TableCell>
                  <Chip 
                    label={session.type} 
                    color={session.type === 'indoor' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{session.duration} minutes</TableCell>
                <TableCell>
                  <Rating 
                    value={session.energyLevel} 
                    readOnly 
                    max={5}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: getQualityColor(session.quality)
                      }}
                    />
                    <Typography>
                      {session.quality}/5
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{session.notes}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEditClick(session)}
                    size="small"
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Session Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Session</DialogTitle>
        <DialogContent>
          {editingSession && (
            <>
              <TextField
                margin="dense"
                name="location"
                label="Location"
                type="text"
                fullWidth
                value={editingSession.location}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                name="type"
                label="Type"
                select
                fullWidth
                value={editingSession.type}
                onChange={handleEditChange}
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
                value={editingSession.duration}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                name="energyLevel"
                label="Energy Level"
                select
                fullWidth
                value={editingSession.energyLevel}
                onChange={handleEditChange}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="quality"
                label="Session Quality"
                select
                fullWidth
                value={editingSession.quality}
                onChange={handleEditChange}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level} - {level === 1 ? 'Poor' : 
                              level === 2 ? 'Below Average' : 
                              level === 3 ? 'Average' : 
                              level === 4 ? 'Good' : 'Excellent'}
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
                value={editingSession.notes}
                onChange={handleEditChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Sessions; 