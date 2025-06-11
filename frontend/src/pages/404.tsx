import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';

export default function Custom404() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button variant="contained" color="primary" href="/">
            Return to Homepage
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 