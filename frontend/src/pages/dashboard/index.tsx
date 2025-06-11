import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Welcome, {user?.username}!
          </Typography>
          <Typography variant="body1">
            You are logged in as: <strong>{user?.role}</strong>
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {user?.role === 'admin' && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    User Management
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Add, update, or remove users from the system.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/users">
                    Manage Users
                  </Button>
                </Paper>
              </Grid>
            </>
          )}

          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Test Management
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Create and manage tests for students.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/tests">
                    Manage Tests
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Exam Management
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Manage exams and view results.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/exams">
                    Manage Exams
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    ML Model Management
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Train and manage handwriting verification models.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/ml-models">
                    Manage Models
                  </Button>
                </Paper>
              </Grid>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    My Tests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    View and take assigned tests.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/my-tests">
                    View Tests
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    My Exams
                  </Typography>
                  <Typography variant="body2" paragraph>
                    View exam results and upload answer sheets.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/my-exams">
                    View Exams
                  </Button>
                </Paper>
              </Grid>
            </>
          )}

          {(user?.role === 'assistant' || user?.role === 'supersub') && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Answer Sheet Evaluation
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Evaluate student answer sheets.
                  </Typography>
                  <Button variant="contained" color="primary" href="/dashboard/evaluations">
                    Evaluate Sheets
                  </Button>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
} 