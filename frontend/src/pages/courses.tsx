import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Mock data for courses
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Career Guidance Fundamentals',
    description: 'Learn the essentials of career planning and development for high school students.',
    instructor: 'Dr. Sarah Johnson',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Career Development',
    rating: 4.7,
    enrolledCount: 256,
    image: '/images/course1.jpg',
    tags: ['Career Planning', 'Self Assessment', 'Goal Setting'],
  },
  {
    id: 2,
    title: 'Academic Planning Workshop',
    description: 'Strategic planning for academic success and college preparation.',
    instructor: 'Prof. Michael Chen',
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Academic Skills',
    rating: 4.5,
    enrolledCount: 189,
    image: '/images/course2.jpg',
    tags: ['Study Skills', 'Time Management', 'College Prep'],
  },
  {
    id: 3,
    title: 'Digital Skills for Students',
    description: 'Essential digital literacy and technology skills for modern education.',
    instructor: 'Emma Rodriguez',
    duration: '4 weeks',
    level: 'All Levels',
    category: 'Technology',
    rating: 4.8,
    enrolledCount: 312,
    image: '/images/course3.jpg',
    tags: ['Digital Literacy', 'Online Learning', 'Productivity Tools'],
  },
  {
    id: 4,
    title: 'College Application Mastery',
    description: 'Comprehensive guide to navigating the college application process successfully.',
    instructor: 'Dr. James Wilson',
    duration: '10 weeks',
    level: 'Advanced',
    category: 'College Preparation',
    rating: 4.9,
    enrolledCount: 427,
    image: '/images/course-placeholder.jpg',
    tags: ['Applications', 'Essays', 'Interviews'],
  },
  {
    id: 5,
    title: 'Financial Literacy for Teens',
    description: 'Learn essential financial concepts and develop money management skills.',
    instructor: 'Lisa Thompson',
    duration: '5 weeks',
    level: 'Beginner',
    category: 'Life Skills',
    rating: 4.6,
    enrolledCount: 203,
    image: '/images/course-placeholder.jpg',
    tags: ['Budgeting', 'Saving', 'Financial Planning'],
  },
  {
    id: 6,
    title: 'Leadership Development',
    description: 'Develop leadership skills and qualities for academic and personal success.',
    instructor: 'Robert Garcia',
    duration: '7 weeks',
    level: 'Intermediate',
    category: 'Personal Development',
    rating: 4.4,
    enrolledCount: 178,
    image: '/images/course-placeholder.jpg',
    tags: ['Leadership', 'Communication', 'Team Building'],
  },
];

// Filter options
const CATEGORIES = ['All Categories', 'Career Development', 'Academic Skills', 'Technology', 'College Preparation', 'Life Skills', 'Personal Development'];
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['Any Duration', 'Under 5 weeks', '5-8 weeks', 'Over 8 weeks'];

const Courses = () => {
  const router = useRouter();
  const { mode } = useThemeContext();
  const { currentUser, loading: authLoading } = useAuth();
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [durationFilter, setDurationFilter] = useState('Any Duration');
  const [sortBy, setSortBy] = useState('popular');
  
  // State for pagination
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;
  
  // State for loading and courses
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<typeof MOCK_COURSES>([]);
  const [filteredCourses, setFilteredCourses] = useState<typeof MOCK_COURSES>([]);
  
  // Simulate loading courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(MOCK_COURSES);
      setLoading(false);
    };
    
    fetchCourses();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...courses];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'All Categories') {
      result = result.filter(course => course.category === categoryFilter);
    }
    
    // Apply level filter
    if (levelFilter !== 'All Levels') {
      result = result.filter(course => course.level === levelFilter);
    }
    
    // Apply duration filter
    if (durationFilter !== 'Any Duration') {
      if (durationFilter === 'Under 5 weeks') {
        result = result.filter(course => {
          const weekCount = parseInt(course.duration.split(' ')[0]);
          return weekCount < 5;
        });
      } else if (durationFilter === '5-8 weeks') {
        result = result.filter(course => {
          const weekCount = parseInt(course.duration.split(' ')[0]);
          return weekCount >= 5 && weekCount <= 8;
        });
      } else if (durationFilter === 'Over 8 weeks') {
        result = result.filter(course => {
          const weekCount = parseInt(course.duration.split(' ')[0]);
          return weekCount > 8;
        });
      }
    }
    
    // Apply sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => b.enrolledCount - a.enrolledCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      // In a real app, we would sort by date
      // For mock data, we'll just use the reverse order
      result.sort((a, b) => b.id - a.id);
    }
    
    setFilteredCourses(result);
    setPage(1); // Reset to first page when filters change
  }, [courses, searchQuery, categoryFilter, levelFilter, durationFilter, sortBy]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCourseClick = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setLevelFilter('All Levels');
    setDurationFilter('Any Duration');
    setSortBy('popular');
  };
  
  return (
    <>
      <Head>
        <title>Courses | EduLift</title>
        <meta name="description" content="Browse our comprehensive collection of educational courses designed to help students succeed academically and prepare for their future." />
      </Head>
      
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          py: 6,
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Explore Courses
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Discover courses designed to help you achieve academic success and prepare for your future
          </Typography>
          
          {/* Search and Filters */}
          <Card sx={{ mb: 4, p: 3, borderRadius: 3 }} className="hover-lift">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search courses..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={categoryFilter}
                        label="Category"
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        {CATEGORIES.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="level-label">Level</InputLabel>
                      <Select
                        labelId="level-label"
                        value={levelFilter}
                        label="Level"
                        onChange={(e) => setLevelFilter(e.target.value)}
                      >
                        {LEVELS.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="duration-label">Duration</InputLabel>
                      <Select
                        labelId="duration-label"
                        value={durationFilter}
                        label="Duration"
                        onChange={(e) => setDurationFilter(e.target.value)}
                      >
                        {DURATIONS.map((duration) => (
                          <MenuItem key={duration} value={duration}>
                            {duration}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterListIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight={500}>
                      Sort by:
                    </Typography>
                    <Button 
                      variant={sortBy === 'popular' ? 'contained' : 'text'} 
                      size="small" 
                      onClick={() => setSortBy('popular')}
                      sx={{ ml: 1, minWidth: 'auto', px: 1.5 }}
                    >
                      Popular
                    </Button>
                    <Button 
                      variant={sortBy === 'rating' ? 'contained' : 'text'} 
                      size="small" 
                      onClick={() => setSortBy('rating')}
                      sx={{ ml: 1, minWidth: 'auto', px: 1.5 }}
                    >
                      Highest Rated
                    </Button>
                    <Button 
                      variant={sortBy === 'newest' ? 'contained' : 'text'} 
                      size="small" 
                      onClick={() => setSortBy('newest')}
                      sx={{ ml: 1, minWidth: 'auto', px: 1.5 }}
                    >
                      Newest
                    </Button>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={resetFilters}
                    sx={{ textTransform: 'none' }}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
          
          {/* Results count */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" fontWeight={500}>
              {loading ? (
                <Skeleton width={150} />
              ) : (
                `Showing ${filteredCourses.length} ${filteredCourses.length === 1 ? 'course' : 'courses'}`
              )}
            </Typography>
          </Box>
          
          {/* Course Grid */}
          {loading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} width="80%" />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={60} />
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={100} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : filteredCourses.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3, mt: 2 }}>
              No courses match your search criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <>
              <Grid container spacing={4}>
                {displayedCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 30px rgba(0, 0, 0, 0.12)',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={course.image}
                        alt={course.title}
                      />
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 1 }}>
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
                            sx={{ ml: 1, borderRadius: 1 }}
                          />
                        </Box>
                        
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {course.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                          {course.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.duration}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 'auto'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={course.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {course.rating}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {course.enrolledCount} students
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size="large"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Courses; 