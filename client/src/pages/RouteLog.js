import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const RouteLog = () => {
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    type: 'boulder', // or 'sport', 'trad'
    location: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    attempts: 1,
    completed: false,
  });

  // Define grade options for different climbing types
  const gradeOptions = {
    boulder: [
      'V0/4', 'V1/5', 'V2/5+', 'V3/6a(+)', 'V4/6c', 'V5/6c+', 'V6/7a', 'V7/7a+', 'V8/7b', 'V8/7b+', 'V9/7c', 'V10/7c+',
      'V11/8a', 'V12/8a+', 'V13/8b', 'V14/8b+', 'V15/8c', 'V16/8c+', 'V17/9a'
    ],
    sport: [
      '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+',
      '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a'
    ],
    trad: [
      '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
      '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d',
      '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d',
      '5.14a', '5.14b', '5.14c', '5.14d', '5.15a', '5.15b', '5.15c', '5.15d'
    ]
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handleOpen = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData(route);
    } else {
      setEditingRoute(null);
      setFormData({
        name: '',
        grade: '',
        type: 'boulder',
        location: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        attempts: 1,
        completed: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoute(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await axios.put(`http://localhost:5001/api/routes/${editingRoute._id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/routes', formData);
      }
      fetchRoutes();
      handleClose();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/routes/${id}`);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Route Log
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          sx={{ mb: 3 }}
        >
          Log New Route
        </Button>

        <Grid container spacing={3}>
          {routes.map((route) => (
            <Grid item xs={12} sm={6} md={4} key={route._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{route.name}</Typography>
                  <Typography color="textSecondary">
                    Grade: {route.grade}
                  </Typography>
                  <Typography color="textSecondary">
                    Type: {route.type}
                  </Typography>
                  <Typography color="textSecondary">
                    Location: {route.location}
                  </Typography>
                  <Typography color="textSecondary">
                    Date: {new Date(route.date).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary">
                    Attempts: {route.attempts}
                  </Typography>
                  <Typography color="textSecondary">
                    Status: {route.completed ? 'Completed' : 'Not Completed'}
                  </Typography>
                  {route.notes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Notes: {route.notes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpen(route)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(route._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingRoute ? 'Edit Route' : 'Log New Route'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Route Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Climbing Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                margin="normal"
                required
              >
                <MenuItem value="boulder">Boulder</MenuItem>
                <MenuItem value="sport">Sport</MenuItem>
                <MenuItem value="trad">Trad</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                margin="normal"
                required
              >
                {gradeOptions[formData.type].map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Attempts"
                name="attempts"
                type="number"
                value={formData.attempts}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingRoute ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default RouteLog; 