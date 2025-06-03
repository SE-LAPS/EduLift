import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for demonstration
  const [upcomingTests, setUpcomingTests] = useState([
    { id: 1, title: 'Mathematics Test', date: '2023-06-15', subject: 'Mathematics' },
    { id: 2, title: 'Science Quiz', date: '2023-06-18', subject: 'Science' }
  ]);
  
  const [recentExams, setRecentExams] = useState([
    { id: 1, title: 'End of Term Exam', date: '2023-05-30', score: 85 },
    { id: 2, title: 'Mid-Term Assessment', date: '2023-04-15', score: 92 }
  ]);
  
  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'student'))) {
      router.push('/login');
    }
  }, [isAuthenticated, user, loading, router]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.first_name}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6">
                Upcoming Tests
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              {upcomingTests.length}
            </Typography>
            <Typography variant="body2">
              Next test: {upcomingTests[0]?.date || 'None scheduled'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6">
                Recent Exams
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              {recentExams.length}
            </Typography>
            <Typography variant="body2">
              Average score: {recentExams.reduce((acc, exam) => acc + exam.score, 0) / recentExams.length}%
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6">
                Learning Progress
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              75%
            </Typography>
            <Typography variant="body2">
              Keep up the good work!
            </Typography>
          </Paper>
        </Grid>
        
        {/* Upcoming Tests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Tests
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {upcomingTests.length > 0 ? (
                <List>
                  {upcomingTests.map((test) => (
                    <ListItem key={test.id} divider>
                      <ListItemText
                        primary={test.title}
                        secondary={`Date: ${test.date} | Subject: ${test.subject}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming tests scheduled.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/student/tests')}>
                View All Tests
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Recent Exams */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Exams
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentExams.length > 0 ? (
                <List>
                  {recentExams.map((exam) => (
                    <ListItem key={exam.id} divider>
                      <ListItemText
                        primary={exam.title}
                        secondary={`Date: ${exam.date} | Score: ${exam.score}%`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent exams.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/student/exams')}>
                View All Exams
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 