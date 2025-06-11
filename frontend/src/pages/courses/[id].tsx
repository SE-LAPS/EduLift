import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Rating,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import BarChartIcon from '@mui/icons-material/BarChart';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for courses
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Career Guidance Fundamentals',
    description: 'Learn the essentials of career planning and development for high school students.',
    longDescription: `This comprehensive course is designed to help high school students navigate the complex world of career planning and development. Through a series of engaging modules, students will learn how to assess their interests, skills, and values to make informed decisions about their future career paths.

The course covers a wide range of topics, including self-assessment techniques, career exploration strategies, goal setting, and action planning. Students will also learn about various industries and professions, as well as the education and training requirements for different career paths.

By the end of this course, students will have a better understanding of themselves and their career options, and will be equipped with the tools and knowledge to make informed decisions about their future.`,
    instructor: 'Dr. Sarah Johnson',
    instructorTitle: 'Career Counselor & Educational Psychologist',
    instructorBio: 'Dr. Sarah Johnson has over 15 years of experience in career counseling and educational psychology. She has helped thousands of students discover their passions and plan their career paths. Dr. Johnson holds a Ph.D. in Educational Psychology from Stanford University and is a certified career counselor.',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Career Development',
    rating: 4.7,
    enrolledCount: 256,
    image: '/images/course1.jpg',
    tags: ['Career Planning', 'Self Assessment', 'Goal Setting'],
    prerequisites: ['None - this course is suitable for all high school students'],
    whatYouWillLearn: [
      'Identify your interests, skills, values, and personality traits',
      'Explore various career options and industries',
      'Set SMART career goals and create action plans',
      'Develop effective decision-making skills',
      'Create a professional portfolio and resume',
      'Prepare for job interviews and college applications',
    ],
    modules: [
      {
        title: 'Introduction to Career Planning',
        lessons: [
          { title: 'Why Career Planning Matters', type: 'video', duration: '15 min' },
          { title: 'Understanding the Career Development Process', type: 'reading', duration: '20 min' },
          { title: 'Setting Expectations and Goals', type: 'interactive', duration: '25 min' },
        ]
      },
      {
        title: 'Self-Assessment',
        lessons: [
          { title: 'Identifying Your Interests', type: 'quiz', duration: '30 min' },
          { title: 'Evaluating Your Skills and Abilities', type: 'interactive', duration: '25 min' },
          { title: 'Understanding Your Values', type: 'video', duration: '20 min' },
          { title: 'Personality Assessment', type: 'quiz', duration: '35 min' },
        ]
      },
      {
        title: 'Career Exploration',
        lessons: [
          { title: 'Researching Career Options', type: 'reading', duration: '30 min' },
          { title: 'Industry Overview and Trends', type: 'video', duration: '25 min' },
          { title: 'Informational Interviews', type: 'interactive', duration: '40 min' },
        ]
      },
      {
        title: 'Goal Setting and Action Planning',
        lessons: [
          { title: 'Setting SMART Career Goals', type: 'video', duration: '20 min' },
          { title: 'Creating Your Action Plan', type: 'interactive', duration: '30 min' },
          { title: 'Overcoming Obstacles', type: 'reading', duration: '15 min' },
        ]
      },
      {
        title: 'Building Your Professional Brand',
        lessons: [
          { title: 'Creating a Professional Portfolio', type: 'video', duration: '25 min' },
          { title: 'Resume Writing Workshop', type: 'interactive', duration: '45 min' },
          { title: 'Interview Skills and Techniques', type: 'video', duration: '30 min' },
          { title: 'Networking Strategies', type: 'reading', duration: '20 min' },
        ]
      },
      {
        title: 'Final Project',
        lessons: [
          { title: 'Career Development Plan Presentation', type: 'project', duration: '60 min' },
          { title: 'Peer Review Session', type: 'interactive', duration: '45 min' },
          { title: 'Course Reflection and Next Steps', type: 'reading', duration: '20 min' },
        ]
      },
    ],
    reviews: [
      {
        id: 1,
        name: 'Michael T.',
        avatar: '',
        rating: 5,
        date: '2023-09-15',
        comment: 'This course was incredibly helpful in guiding me through the career planning process. The self-assessment tools were particularly valuable in helping me identify my strengths and interests.',
      },
      {
        id: 2,
        name: 'Jessica L.',
        avatar: '',
        rating: 4,
        date: '2023-08-22',
        comment: 'Dr. Johnson is an excellent instructor who clearly explains complex concepts. The course materials were well-organized and engaging.',
      },
      {
        id: 3,
        name: 'David R.',
        avatar: '',
        rating: 5,
        date: '2023-07-10',
        comment: 'I highly recommend this course to any high school student who is unsure about their future career path. The interactive exercises and real-world examples made the content relatable and practical.',
      },
    ],
  },
  // Other courses would be defined here
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CourseDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { mode } = useThemeContext();
  const { currentUser, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find course by ID
        const foundCourse = MOCK_COURSES.find(c => c.id === Number(id));
        if (foundCourse) {
          setCourse(foundCourse);
          // Check if user is already enrolled (in a real app, this would come from the API)
          setEnrolled(Math.random() > 0.7); // Random enrollment status for demo
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleEnroll = async () => {
    if (!currentUser) {
      router.push('/login?redirect=' + encodeURIComponent(`/courses/${id}`));
      return;
    }
    
    setEnrolling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnrolled(true);
    } catch (err) {
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
          : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (error || !course) {
    return (
      <Box sx={{ 
        py: 8,
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
          : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
      }}>
        <Container>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
            {error || 'Course not found'}
          </Alert>
          <Button 
            variant="contained" 
            component={Link} 
            href="/courses"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back to Courses
          </Button>
        </Container>
      </Box>
    );
  }
  
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlineIcon />;
      case 'reading':
        return <ArticleIcon />;
      case 'quiz':
        return <QuizIcon />;
      case 'interactive':
        return <BarChartIcon />;
      case 'project':
        return <SchoolIcon />;
      default:
        return <ArticleIcon />;
    }
  };
  
  return (
    <>
      <Head>
        <title>{course.title} | EduLift</title>
        <meta name="description" content={course.description} />
      </Head>
      
      <Box 
        sx={{ 
          py: 6,
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
        }}
      >
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink component={Link} href="/" underline="hover" color="inherit">
              Home
            </MuiLink>
            <MuiLink component={Link} href="/courses" underline="hover" color="inherit">
              Courses
            </MuiLink>
            <Typography color="text.primary">{course.title}</Typography>
          </Breadcrumbs>
          
          {/* Course Header */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={course.category} 
                    size="small" 
                    color="primary" 
                    sx={{ borderRadius: 1, fontWeight: 500 }}
                  />
                  <Chip 
                    label={course.level} 
                    size="small" 
                    variant="outlined" 
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {course.instructor}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {course.duration}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Rating value={course.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {course.rating} ({course.reviews.length} reviews)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {course.enrolledCount} students enrolled
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Course Image */}
              <Box 
                component="img" 
                src={course.image} 
                alt={course.title}
                sx={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Course Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="course tabs"
                  sx={{
                    '& .MuiTab-root': {
                      py: 2,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label="Curriculum" />
                  <Tab label="Instructor" />
                  <Tab label="Reviews" />
                </Tabs>
              </Box>
              
              {/* Tab Panels */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  About This Course
                </Typography>
                <Typography variant="body1" paragraph>
                  {course.longDescription}
                </Typography>
                
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
                  What You Will Learn
                </Typography>
                <Grid container spacing={2}>
                  {course.whatYouWillLearn.map((item: string, index: number) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CheckCircleIcon color="primary" sx={{ mr: 1, mt: 0.3 }} />
                        <Typography variant="body1">{item}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
                  Prerequisites
                </Typography>
                <List>
                  {course.prerequisites.map((item: string, index: number) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Course Curriculum
                </Typography>
                <Typography variant="body1" paragraph>
                  This course includes {course.modules.length} modules with {
                    course.modules.reduce((total: number, module: any) => total + module.lessons.length, 0)
                  } lessons.
                </Typography>
                
                {course.modules.map((module: any, index: number) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Module {index + 1}: {module.title}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <List disablePadding>
                        {module.lessons.map((lesson: any, lessonIndex: number) => (
                          <ListItem 
                            key={lessonIndex}
                            divider={lessonIndex < module.lessons.length - 1}
                            sx={{ 
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            <ListItemIcon>
                              {getLessonTypeIcon(lesson.type)}
                            </ListItemIcon>
                            <ListItemText 
                              primary={lesson.title} 
                              secondary={`${lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • ${lesson.duration}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Box>
                ))}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Meet Your Instructor
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ width: 80, height: 80, mr: 2 }}
                    alt={course.instructor}
                    src="/images/avatar-placeholder.jpg"
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {course.instructor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructorTitle}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {course.instructorBio}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Student Reviews
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ textAlign: 'center', mr: 4 }}>
                    <Typography variant="h2" fontWeight={700} color="primary">
                      {course.rating}
                    </Typography>
                    <Rating value={course.rating} precision={0.1} readOnly size="large" />
                    <Typography variant="body2" color="text.secondary">
                      {course.reviews.length} reviews
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  
                  <Box sx={{ flexGrow: 1 }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = course.reviews.filter((r: any) => Math.round(r.rating) === star).length;
                      const percentage = (count / course.reviews.length) * 100;
                      return (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ minWidth: 20 }}>
                            {star}
                          </Typography>
                          <StarIcon sx={{ color: 'gold', fontSize: 16, mx: 0.5 }} />
                          <Box sx={{ flexGrow: 1, mx: 1 }}>
                            <Box 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4, 
                                bgcolor: 'grey.200',
                                overflow: 'hidden'
                              }}
                            >
                              <Box 
                                sx={{ 
                                  height: '100%', 
                                  width: `${percentage}%`, 
                                  bgcolor: 'primary.main',
                                  borderRadius: 4
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {percentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {course.reviews.map((review: any) => (
                  <Box key={review.id} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ width: 40, height: 40, mr: 2 }}
                        alt={review.name}
                        src={review.avatar || '/images/avatar-placeholder.jpg'}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {review.comment}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </TabPanel>
            </Grid>
            
            {/* Course Sidebar */}
            <Grid item xs={12} md={4}>
              <Card 
                className="hover-lift"
                sx={{ 
                  borderRadius: 3, 
                  position: { md: 'sticky' },
                  top: { md: 80 },
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {enrolled ? (
                    <>
                      <Alert severity="success" sx={{ mb: 3 }}>
                        You are enrolled in this course
                      </Alert>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        component={Link}
                        href={`/dashboard`}
                        sx={{ 
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Go to Dashboard
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                    </Button>
                  )}
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Course Includes:
                    </Typography>
                    <List disablePadding>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <AccessTimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={course.duration} 
                          secondary="Duration" 
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ArticleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${course.modules.length} Modules`} 
                          secondary="Course Structure" 
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <PlayCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${course.modules.reduce((total: number, module: any) => 
                            total + module.lessons.filter((l: any) => l.type === 'video').length, 0)} Video Lessons`} 
                          secondary="Learn at your own pace" 
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <QuizIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${course.modules.reduce((total: number, module: any) => 
                            total + module.lessons.filter((l: any) => l.type === 'quiz').length, 0)} Quizzes`} 
                          secondary="Test your knowledge" 
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Certificate of Completion" 
                          secondary="Upon finishing the course" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Share This Course:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" sx={{ minWidth: 0, p: 1 }}>
                        <Box component="img" src="/images/facebook-icon.svg" alt="Facebook" width={24} height={24} />
                      </Button>
                      <Button variant="outlined" size="small" sx={{ minWidth: 0, p: 1 }}>
                        <Box component="img" src="/images/twitter-icon.svg" alt="Twitter" width={24} height={24} />
                      </Button>
                      <Button variant="outlined" size="small" sx={{ minWidth: 0, p: 1 }}>
                        <Box component="img" src="/images/linkedin-icon.svg" alt="LinkedIn" width={24} height={24} />
                      </Button>
                      <Button variant="outlined" size="small" sx={{ minWidth: 0, p: 1 }}>
                        <Box component="img" src="/images/email-icon.svg" alt="Email" width={24} height={24} />
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CourseDetail; 