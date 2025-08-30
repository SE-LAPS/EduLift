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
  Computer as ComputerIcon,
  Memory as AIIcon,
  Science as ScienceIcon,
  Calculate as MathIcon,
  MusicNote as MusicIcon,
  Business as CommerceIcon,
  Palette as ArtIcon,
  Router as NetworkIcon,
  BarChart as StatsIcon,
  Public as SocialScienceIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

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

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Information Technology': return <ComputerIcon />;
      case 'Artificial Intelligence': return <AIIcon />;
      case 'Machine Learning': return <PsychologyIcon />;
      case 'IQ Test': return <PsychologyIcon />;
      case 'Science Test': return <ScienceIcon />;
      case 'Statistics': return <StatsIcon />;
      case 'Mathematics': return <MathIcon />;
      case 'Network': return <NetworkIcon />;
      case 'Music': return <MusicIcon />;
      case 'Commerce': return <CommerceIcon />;
      case 'Art': return <ArtIcon />;
      case 'Social Science': return <SocialScienceIcon />;
      default: return <QuizIcon />;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Information Technology': '#2196F3',
      'Artificial Intelligence': '#9C27B0',
      'Machine Learning': '#FF9800',
      'IQ Test': '#E91E63',
      'Science Test': '#4CAF50',
      'Statistics': '#00BCD4',
      'Mathematics': '#3F51B5',
      'Network': '#607D8B',
      'Music': '#795548',
      'Commerce': '#009688',
      'Art': '#FF5722',
      'Social Science': '#673AB7'
    };
    return colors[subject] || '#757575';
  };

  const getProgressData = () => {
    const totalQuestions = questions.length;
    const totalTests = tests.length;
    const totalResults = testResults.length;
    
    switch (activeTab) {
      case 0: // Test Management
        return [
          { label: 'Published Tests', value: tests.filter(t => t.status === 'published').length, total: totalTests, color: '#4CAF50' },
          { label: 'Draft Tests', value: tests.filter(t => t.status === 'draft').length, total: totalTests, color: '#FF9800' },
          { label: 'Active Categories', value: Object.keys(tests.reduce((acc, test) => ({ ...acc, [test.subject]: true }), {})).length, total: 12, color: '#2196F3' }
        ];
      case 1: // Question Bank
        return [
          { label: 'Total Questions', value: totalQuestions, total: Math.max(totalQuestions, 100), color: '#9C27B0' },
          { label: 'Easy Questions', value: questions.filter(q => q.difficulty === 'easy').length, total: totalQuestions, color: '#4CAF50' },
          { label: 'Hard Questions', value: questions.filter(q => q.difficulty === 'hard').length, total: totalQuestions, color: '#F44336' }
        ];
      case 2: // Analytics
        return [
          { label: 'Test Attempts', value: totalResults, total: Math.max(totalResults, 50), color: '#00BCD4' },
          { label: 'High Performers', value: testResults.filter(r => (r.score / r.total_points) >= 0.8).length, total: totalResults, color: '#4CAF50' },
          { label: 'Completion Rate', value: Math.round((totalResults / (totalTests * 10)) * 100), total: 100, color: '#FF9800' }
        ];
      default:
        return [];
    }
  };

  const renderProgressBar = () => {
    const progressData = getProgressData();
    
    return (
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {activeTab === 0 ? 'Test Management Progress' : activeTab === 1 ? 'Question Bank Progress' : 'Analytics Overview'}
          </Typography>
          <Grid container spacing={3}>
            {progressData.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.value}/{item.total}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / item.total) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                    {Math.round((item.value / item.total) * 100)}% Complete
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderTestManagement = () => (
    <Box>
      {renderProgressBar()}
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={test.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: `4px solid ${getSubjectColor(test.subject)}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: getSubjectColor(test.subject), 
                      mr: 2, 
                      width: 48, 
                      height: 48 
                    }}
                  >
                    {getSubjectIcon(test.subject)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.2 }}>
                      {test.title}
                    </Typography>
                  <Chip 
                    label={test.status} 
                    color={test.status === 'published' ? 'success' : test.status === 'draft' ? 'warning' : 'default'}
                    size="small"
                  />
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', height: 40, overflow: 'hidden' }}>
                  {test.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={test.subject} 
                    size="small" 
                    sx={{ 
                      mr: 1, 
                      bgcolor: `${getSubjectColor(test.subject)}20`,
                      color: getSubjectColor(test.subject),
                      fontWeight: 600
                    }} 
                  />
                  <Chip 
                    label={test.adaptive ? 'Adaptive' : 'Fixed'} 
                    size="small" 
                    color={test.adaptive ? 'primary' : 'default'}
                    sx={{ mr: 1 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Questions</Typography>
                    <Typography variant="h6" color="primary">{test.total_questions}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Duration</Typography>
                    <Typography variant="h6" color="secondary">{test.duration}min</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Level</Typography>
                    <Typography variant="h6" color="warning.main">{test.difficulty_level}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStartTest(test)}
                    disabled={test.status !== 'published'}
                    fullWidth
                    sx={{ bgcolor: getSubjectColor(test.subject) }}
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
      {renderProgressBar()}
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

  const getAnalyticsData = () => {
    // Subject distribution data
    const subjectCounts = tests.reduce((acc, test) => {
      acc[test.subject] = (acc[test.subject] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Difficulty distribution
    const difficultyCount = tests.reduce((acc, test) => {
      acc[test.difficulty_level] = (acc[test.difficulty_level] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Test performance over time (sample data)
    const performanceData = [
      { month: 'Jan', avgScore: 75, totalAttempts: 45 },
      { month: 'Feb', avgScore: 78, totalAttempts: 52 },
      { month: 'Mar', avgScore: 82, totalAttempts: 61 },
      { month: 'Apr', avgScore: 79, totalAttempts: 58 },
      { month: 'May', avgScore: 85, totalAttempts: 67 },
      { month: 'Jun', avgScore: 88, totalAttempts: 73 }
    ];

    // Subject performance radar data
    const subjectPerformance = {
      'Information Technology': 82,
      'Artificial Intelligence': 75,
      'Machine Learning': 79,
      'IQ Test': 85,
      'Science Test': 81,
      'Statistics': 78,
      'Mathematics': 83,
      'Network': 77,
      'Music': 86,
      'Commerce': 80,
      'Art': 84,
      'Social Science': 79
    };

    return {
      subjectCounts,
      difficultyCount,
      performanceData,
      subjectPerformance
    };
  };

  const analyticsData = getAnalyticsData();

  const subjectDistributionChart = {
    labels: Object.keys(analyticsData.subjectCounts),
    datasets: [
      {
        data: Object.values(analyticsData.subjectCounts),
        backgroundColor: [
          '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#4CAF50', 
          '#00BCD4', '#3F51B5', '#607D8B', '#795548', '#009688', '#FF5722', '#673AB7'
        ],
        borderWidth: 0,
      },
    ],
  };

  const difficultyChart = {
    labels: Object.keys(analyticsData.difficultyCount),
    datasets: [
      {
        label: 'Number of Tests',
        data: Object.values(analyticsData.difficultyCount),
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const performanceChart = {
    labels: analyticsData.performanceData.map(d => d.month),
    datasets: [
      {
        label: 'Average Score (%)',
        data: analyticsData.performanceData.map(d => d.avgScore),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Test Attempts',
        data: analyticsData.performanceData.map(d => d.totalAttempts),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const radarChart = {
    labels: Object.keys(analyticsData.subjectPerformance),
    datasets: [
      {
        label: 'Average Performance (%)',
        data: Object.values(analyticsData.subjectPerformance),
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#2196F3',
        borderWidth: 2,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2196F3',
      },
    ],
  };

  const renderAnalytics = () => (
    <Box>
      {renderProgressBar()}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Advanced Test Analytics & Insights
      </Typography>
      
      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">Total Tests</Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {tests.length}
              </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active: {tests.filter(t => t.status === 'published').length}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">Question Bank</Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {questions.length}
              </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {Object.keys(analyticsData.subjectCounts).length} Subjects
                  </Typography>
                </Box>
                <QuizIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">Test Attempts</Typography>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {testResults.length}
              </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    This Month: 245
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">Avg Success Rate</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    82%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +5% from last month
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 48, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Test Distribution by Subject
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={subjectDistributionChart} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Difficulty Level Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={difficultyChart} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Performance Trends Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={performanceChart} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Month'
                        }
                      },
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        title: {
                          display: true,
                          text: 'Average Score (%)'
                        }
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        title: {
                          display: true,
                          text: 'Test Attempts'
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Subject Performance Radar
              </Typography>
              <Box sx={{ height: 300 }}>
                <Radar 
                  data={radarChart} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: {
                          display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Test Results Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Test Results</Typography>
          <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Completion Time</TableCell>
              <TableCell>Accuracy Rate</TableCell>
              <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testResults.map((result, index) => {
              const test = tests.find(t => t.id === result.test_id);
              const percentage = Math.round((result.score / result.total_points) * 100);
              return (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                            {result.student_name.charAt(0)}
                          </Avatar>
                          {result.student_name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {test?.title || 'Unknown Test'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {test?.subject}
                          </Typography>
                        </Box>
                      </TableCell>
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
                      <TableCell>
                        <Chip 
                          label={`${result.completion_time} min`} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <LinearProgress 
                          variant="determinate" 
                          value={result.adaptive_performance.accuracy_rate * 100} 
                          sx={{ mr: 1, width: 60 }}
                        />
                        {Math.round(result.adaptive_performance.accuracy_rate * 100)}%
                      </TableCell>
                  <TableCell>{new Date(result.date_taken).toLocaleDateString()}</TableCell>
                  <TableCell>
                        <Tooltip title="View Detailed Analysis">
                          <IconButton size="small" color="primary">
                            <AnalyticsIcon />
                          </IconButton>
                        </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
        </CardContent>
      </Card>
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
    <>
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
    </>
  );
};

export default TestManagement; 