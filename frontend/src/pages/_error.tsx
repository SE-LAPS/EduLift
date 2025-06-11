import React from 'react';
import { NextPageContext } from 'next';
import { Box, Typography, Container, Button, Paper } from '@mui/material';

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {statusCode ? `Error ${statusCode}` : 'An error occurred'}
          </Typography>
          <Typography variant="body1" paragraph>
            {message || 'We encountered an unexpected error. Please try again later.'}
          </Typography>
          <Button variant="contained" color="primary" href="/">
            Go to Homepage
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 