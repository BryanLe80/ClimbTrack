import React from 'react';
import { Typography, Container } from '@mui/material';

function Profile({ user, onUpdate }) {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Profile management functionality coming soon...
      </Typography>
    </Container>
  );
}

export default Profile; 