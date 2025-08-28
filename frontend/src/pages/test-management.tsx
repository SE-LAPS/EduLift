import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Switch,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  topic: string;
  points: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // minutes
  total_questions: number;
  difficulty_level: string;
  adaptive: boolean;
  created_date: string;
  status: 'draft' | 'published' | 'archived';
}

interface TestResult {
  test_id: string;
  student_name: string;
  score: number;
  total_points: number;
  completion_time: number;
  adaptive_performance: {
    difficulty_progression: string[];
    accuracy_rate: number;
    learning_insights: string[];
  };
  date_taken: string;
}

const TestManagement = () => {
  const { mode } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dialog states
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  const [takeTestOpen, setTakeTestOpen] = useState(false);
  
  // Form states
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 60,
    difficulty_level: 'medium',
    adaptive: true
  });
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'multiple_choice' as const,
    options: ['', '', '', ''],
    correct_answer: '',
    difficulty: 'medium' as const,
    subject: '',
    topic: '',
    points: 1
  });

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<{[key: string]: any}>({});
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load tests, questions, and results
      const [testsRes, questionsRes, resultsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/test-management/tests'),
        axios.get('http://localhost:5000/api/test-management/questions'),
        axios.get('http://localhost:5000/api/test-management/results')
      ]);
      
      setTests(testsRes.data.tests || []);
      setQuestions(questionsRes.data.questions || []);
      setTestResults(resultsRes.data.results || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/test-management/tests', newTest);
      setTests(prev => [...prev, response.data.test]);
      setCreateTestOpen(false);
      setNewTest({
        title: '',
        description: '',
        subject: '',
        duration: 60,
        difficulty_level: 'medium',
        adaptive: true
      });
    } catch (err) {
      setError('Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/test-management/questions', newQuestion);
      setQuestions(prev => [...prev, response.data.question]);
      setCreateQuestionOpen(false);
      setNewQuestion({
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        difficulty: 'medium',
        subject: '',
        topic: '',
        points: 1
      });
    } catch (err) {
      setError('Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setTestAnswers({});
    setTestStartTime(new Date());
    setTakeTestOpen(true);
  };

  const handleSubmitTest = async () => {
    if (!selectedTest || !testStartTime) return;
    
    setLoading(true);
    try {
      const completionTime = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000 / 60);
      
      const testData = {
        test_id: selectedTest.id,
        answers: testAnswers,
        completion_time: completionTime,
        student_name: 'Test Student' // In real app, this would come from authentication
      };
      
      const response = await axios.post('http://localhost:5000/api/test-management/submit', testData);
      setTestResults(prev => [...prev, response.data.result]);
      setTakeTestOpen(false);
      setSelectedTest(null);
    } catch (err) {
      setError('Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const renderTestManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Test Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateTestOpen(true)}
        >
          Create New Test
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {tests.map((test) => (
          <Grid item xs={12} md={6} lg={4} key={test.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{test.title}</Typography>
                  <Chip 
                    label={test.status} 
                    color={test.status === 'published' ? 'success' : test.status === 'draft' ? 'warning' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {test.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip label={test.subject} size="small" sx={{ mr: 1 }} />
                  <Chip 
                    label={test.adaptive ? 'Adaptive' : 'Fixed'} 
                    size="small" 
                    color={test.adaptive ? 'primary' : 'default'}
                    sx={{ mr: 1 }}
                  />
                  <Chip label={`${test.duration}min`} size="small" />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Questions: {test.total_questions} | Level: {test.difficulty_level}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartTest(test)}
                    disabled={test.status !== 'published'}
                  >
                    Take Test
                  </Button>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderQuestionBank = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Question Bank
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateQuestionOpen(true)}
        >
          Add Question
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" noWrap>
                    {question.question}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={question.type.replace('_', ' ')} size="small" />
                </TableCell>
                <TableCell>{question.subject}</TableCell>
                <TableCell>{question.topic}</TableCell>
                <TableCell>
                  <Chip 
                    label={question.difficulty} 
                    size="small"
                    color={
                      question.difficulty === 'easy' ? 'success' :
                      question.difficulty === 'medium' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Test Analytics & Results
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Tests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {tests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Questions
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {questions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Test Attempts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {testResults.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Avg Score
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {testResults.length > 0 
                  ? Math.round(testResults.reduce((sum, result) => sum + (result.score / result.total_points * 100), 0) / testResults.length)
                  : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h5" sx={{ mb: 2 }}>Recent Test Results</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Completion Time</TableCell>
              <TableCell>Accuracy Rate</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testResults.map((result, index) => {
              const test = tests.find(t => t.id === result.test_id);
              const percentage = Math.round((result.score / result.total_points) * 100);
              return (
                <TableRow key={index}>
                  <TableCell>{result.student_name}</TableCell>
                  <TableCell>{test?.title || 'Unknown Test'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {result.score}/{result.total_points}
                      </Typography>
                      <Chip 
                        label={`${percentage}%`}
                        size="small"
                        color={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{result.completion_time} min</TableCell>
                  <TableCell>{Math.round(result.adaptive_performance.accuracy_rate * 100)}%</TableCell>
                  <TableCell>{new Date(result.date_taken).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTestTaking = () => {
    if (!selectedTest) return null;
    
    const testQuestions = questions.filter(q => q.subject === selectedTest.subject).slice(0, selectedTest.total_questions);
    const currentQ = testQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
    
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {selectedTest.title}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Question {currentQuestion + 1} of {testQuestions.length}
          </Typography>
        </Box>
        
        {currentQ && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {currentQ.question}
              </Typography>
              
              {currentQ.type === 'multiple_choice' && currentQ.options && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={testAnswers[currentQ.id] || ''}
                    onChange={(e) => setTestAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  >
                    {currentQ.options.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
              
              {currentQ.type === 'true_false' && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={testAnswers[currentQ.id] || ''}
                    onChange={(e) => setTestAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              )}
              
              {currentQ.type === 'short_answer' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={testAnswers[currentQ.id] || ''}
                  onChange={(e) => setTestAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  placeholder="Enter your answer here..."
                />
              )}
            </CardContent>
          </Card>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Box>
            {currentQuestion < testQuestions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitTest}
                disabled={loading}
              >
                Submit Test
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          py: 15,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Typography variant="h1" sx={{ fontWeight: 800, mb: 3 }}>
                AI-Powered <span style={{ color: '#ffd700' }}>Test Management</span>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Create, manage, and administer adaptive tests with automated grading,
                intelligent question selection, and comprehensive analytics.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<AutoAwesomeIcon />} label="Adaptive Testing" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<SpeedIcon />} label="Auto Grading" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<AnalyticsIcon />} label="Smart Analytics" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Box sx={{ textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="Test Management" icon={<AssignmentIcon />} />
              <Tab label="Question Bank" icon={<QuizIcon />} />
              <Tab label="Analytics" icon={<AnalyticsIcon />} />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {activeTab === 0 && renderTestManagement()}
            {activeTab === 1 && renderQuestionBank()}
            {activeTab === 2 && renderAnalytics()}
          </Paper>
        </Container>
      </Box>

      {/* Create Test Dialog */}
      <Dialog open={createTestOpen} onClose={() => setCreateTestOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Test</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Title"
                value={newTest.title}
                onChange={(e) => setNewTest(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTest.description}
                onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={newTest.subject}
                  onChange={(e) => setNewTest(prev => ({ ...prev, subject: e.target.value }))}
                >
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={newTest.duration}
                onChange={(e) => setNewTest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={newTest.difficulty_level}
                  onChange={(e) => setNewTest(prev => ({ ...prev, difficulty_level: e.target.value }))}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newTest.adaptive}
                    onChange={(e) => setNewTest(prev => ({ ...prev, adaptive: e.target.checked }))}
                  />
                }
                label="Adaptive Testing"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTestOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTest} variant="contained" disabled={loading}>
            Create Test
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Question Dialog */}
      <Dialog open={createQuestionOpen} onClose={() => setCreateQuestionOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="true_false">True/False</MenuItem>
                  <MenuItem value="short_answer">Short Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject"
                value={newQuestion.subject}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Topic"
                value={newQuestion.topic}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, topic: e.target.value }))}
              />
            </Grid>
            
            {newQuestion.type === 'multiple_choice' && (
              <>
                {newQuestion.options.map((option, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correct Answer"
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateQuestionOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateQuestion} variant="contained" disabled={loading}>
            Add Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Take Test Dialog */}
      <Dialog open={takeTestOpen} onClose={() => setTakeTestOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedTest?.title}
          {selectedTest?.adaptive && (
            <Chip label="Adaptive Test" color="primary" size="small" sx={{ ml: 2 }} />
          )}
        </DialogTitle>
        <DialogContent>
          {renderTestTaking()}
        </DialogContent>
              </Dialog>
    </Layout>
  );
};

export default TestManagement; 