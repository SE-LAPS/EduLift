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
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for demonstration
  const [tests, setTests] = useState([
    { id: 1, title: 'Mathematics Test', date: '2023-06-15', subject: 'Mathematics', students: 25 },
    { id: 2, title: 'Science Quiz', date: '2023-06-18', subject: 'Science', students: 18 }
  ]);
  
  const [exams, setExams] = useState([
    { id: 1, title: 'End of Term Exam', date: '2023-05-30', submissions: 22, evaluations: 15 },
    { id: 2, title: 'Mid-Term Assessment', date: '2023-04-15', submissions: 20, evaluations: 20 }
  ]);
  
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', role: 'student', tests: 5, exams: 2 },
    { id: 2, name: 'Jane Smith', role: 'supersub', tests: 6, exams: 2 },
    { id: 3, name: 'Bob Johnson', role: 'student', tests: 4, exams: 1 }
  ]);
  
  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'teacher'))) {
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
                Tests
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              {tests.length}
            </Typography>
            <Typography variant="body2">
              Next test: {tests[0]?.date || 'None scheduled'}
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
                Exams
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              {exams.length}
            </Typography>
            <Typography variant="body2">
              Pending evaluations: {exams.reduce((acc, exam) => acc + (exam.submissions - exam.evaluations), 0)}
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
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6">
                Students
              </Typography>
            </Box>
            <Typography component="p" variant="h3">
              {students.length}
            </Typography>
            <Typography variant="body2">
              SuperSubs: {students.filter(s => s.role === 'supersub').length}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Tests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tests
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {tests.length > 0 ? (
                <List>
                  {tests.map((test) => (
                    <ListItem key={test.id} divider>
                      <ListItemText
                        primary={test.title}
                        secondary={`Date: ${test.date} | Subject: ${test.subject} | Students: ${test.students}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tests created.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/teacher/tests')}>
                Manage Tests
              </Button>
              <Button size="small" color="primary" onClick={() => router.push('/teacher/tests/new')}>
                Create New Test
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Exams */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Exams
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {exams.length > 0 ? (
                <List>
                  {exams.map((exam) => (
                    <ListItem key={exam.id} divider>
                      <ListItemText
                        primary={exam.title}
                        secondary={`Date: ${exam.date} | Submissions: ${exam.submissions} | Evaluated: ${exam.evaluations}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No exams created.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/teacher/exams')}>
                Manage Exams
              </Button>
              <Button size="small" color="primary" onClick={() => router.push('/teacher/exams/new')}>
                Create New Exam
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Students */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Students
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {students.length > 0 ? (
                <List>
                  {students.map((student) => (
                    <ListItem key={student.id} divider>
                      <ListItemText
                        primary={student.name}
                        secondary={`Role: ${student.role} | Tests: ${student.tests} | Exams: ${student.exams}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No students available.
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/teacher/students')}>
                View All Students
              </Button>
              <Button size="small" color="primary" onClick={() => router.push('/teacher/ml-models')}>
                Manage ML Models
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 