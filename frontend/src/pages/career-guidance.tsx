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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Avatar,
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
  WorkOutline as WorkIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

interface PersonalityQuestion {
  id: string;
  question: string;
  category: 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';
}

interface SkillAssessment {
  skill: string;
  level: number;
  category: 'Technical' | 'Creative' | 'Analytical' | 'Social' | 'Leadership';
}

interface CareerRecommendation {
  title: string;
  match_percentage: number;
  description: string;
  required_skills: string[];
  salary_range: string;
  growth_prospects: string;
  education_path: string[];
  personality_fit: string;
}

const CareerGuidance = () => {
  const { mode } = useThemeContext();
  const [activeStep, setActiveStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    education_level: '',
    interests: [] as string[],
  });
  const [personalityAnswers, setPersonalityAnswers] = useState<{[key: string]: number}>({});
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const steps = [
    'Personal Information',
    'Personality Assessment', 
    'Skills Evaluation',
    'Career Recommendations'
  ];

  const personalityQuestions: PersonalityQuestion[] = [
    { id: '1', question: 'I enjoy trying new experiences and exploring novel ideas', category: 'Openness' },
    { id: '2', question: 'I am systematic and organized in my approach to tasks', category: 'Conscientiousness' },
    { id: '3', question: 'I feel energized when working with groups of people', category: 'Extraversion' },
    { id: '4', question: 'I prefer to cooperate rather than compete with others', category: 'Agreeableness' },
    { id: '5', question: 'I often worry about things that might go wrong', category: 'Neuroticism' },
    { id: '6', question: 'I enjoy intellectual discussions and abstract thinking', category: 'Openness' },
    { id: '7', question: 'I always complete tasks on time and meet deadlines', category: 'Conscientiousness' },
    { id: '8', question: 'I am comfortable being the center of attention', category: 'Extraversion' },
    { id: '9', question: 'I go out of my way to help others', category: 'Agreeableness' },
    { id: '10', question: 'I remain calm in stressful situations', category: 'Neuroticism' },
  ];

  const skillCategories = [
    { name: 'Mathematics & Logic', category: 'Analytical' as const },
    { name: 'Communication', category: 'Social' as const },
    { name: 'Creative Writing', category: 'Creative' as const },
    { name: 'Problem Solving', category: 'Analytical' as const },
    { name: 'Leadership', category: 'Leadership' as const },
    { name: 'Programming/Technology', category: 'Technical' as const },
    { name: 'Art & Design', category: 'Creative' as const },
    { name: 'Public Speaking', category: 'Social' as const },
    { name: 'Team Management', category: 'Leadership' as const },
    { name: 'Data Analysis', category: 'Technical' as const },
  ];

  const interestOptions = [
    'Technology', 'Healthcare', 'Education', 'Business', 'Arts', 'Science',
    'Sports', 'Environment', 'Social Work', 'Engineering', 'Finance', 'Media'
  ];

  const handlePersonalInfoChange = (field: string, value: any) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePersonalityAnswer = (questionId: string, value: number) => {
    setPersonalityAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSkillAssessment = (skillIndex: number, level: number) => {
    const skill = skillCategories[skillIndex];
    setSkillAssessments(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(s => s.skill === skill.name);
      if (existingIndex >= 0) {
        updated[existingIndex] = { skill: skill.name, category: skill.category, level };
      } else {
        updated.push({ skill: skill.name, category: skill.category, level });
      }
      return updated;
    });
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const assessmentData = {
        personal_info: personalInfo,
        personality_scores: personalityAnswers,
        skills: skillAssessments,
      };

      const response = await axios.post('http://localhost:5000/api/career-guidance/analyze', assessmentData);
      setRecommendations(response.data.recommendations);
      setActiveStep(3);
    } catch (err: any) {
      setError('Failed to generate career recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      generateRecommendations();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return personalInfo.name && personalInfo.age && personalInfo.education_level && personalInfo.interests.length > 0;
      case 1:
        return Object.keys(personalityAnswers).length === personalityQuestions.length;
      case 2:
        return skillAssessments.length === skillCategories.length;
      default:
        return false;
    }
  };

  const renderPersonalInfoStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={personalInfo.name}
          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={personalInfo.age}
          onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Education Level</FormLabel>
          <RadioGroup
            value={personalInfo.education_level}
            onChange={(e) => handlePersonalInfoChange('education_level', e.target.value)}
          >
            <FormControlLabel value="o_level" control={<Radio />} label="O/L Completed" />
            <FormControlLabel value="a_level" control={<Radio />} label="A/L Completed" />
            <FormControlLabel value="diploma" control={<Radio />} label="Diploma" />
            <FormControlLabel value="degree" control={<Radio />} label="Bachelor's Degree" />
            <FormControlLabel value="postgraduate" control={<Radio />} label="Postgraduate" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>Areas of Interest</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {interestOptions.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              onClick={() => handleInterestToggle(interest)}
              color={personalInfo.interests.includes(interest) ? 'primary' : 'default'}
              variant={personalInfo.interests.includes(interest) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const renderPersonalityStep = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Rate each statement based on how accurately it describes you (1 = Strongly Disagree, 5 = Strongly Agree)
      </Typography>
      {personalityQuestions.map((question, index) => (
        <Card key={question.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {index + 1}. {question.question}
            </Typography>
            <RadioGroup
              row
              value={personalityAnswers[question.id] || ''}
              onChange={(e) => handlePersonalityAnswer(question.id, parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={value.toString()}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderSkillsStep = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Rate your current skill level in each area (1 = Beginner, 5 = Expert)
      </Typography>
      <Grid container spacing={2}>
        {skillCategories.map((skill, index) => {
          const currentAssessment = skillAssessments.find(s => s.skill === skill.name);
          return (
            <Grid item xs={12} key={skill.name}>
              <Card>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                      Beginner
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(currentAssessment?.level || 0) * 20}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                      Expert
                    </Typography>
                  </Box>
                  <RadioGroup
                    row
                    value={currentAssessment?.level || ''}
                    onChange={(e) => handleSkillAssessment(index, parseInt(e.target.value))}
                    sx={{ mt: 1 }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio />}
                        label={value.toString()}
                      />
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderRecommendationsStep = () => (
    <Box>
      {recommendations.length > 0 ? (
        <Grid container spacing={3}>
          {recommendations.map((rec, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ border: index === 0 ? 2 : 1, borderColor: index === 0 ? 'primary.main' : 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <WorkIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {rec.title}
                        {index === 0 && <StarIcon sx={{ color: 'gold', ml: 1 }} />}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {rec.match_percentage}% Match
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {rec.description}
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Career Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Required Skills:
                          </Typography>
                          <List dense>
                            {rec.required_skills.map((skill, skillIndex) => (
                              <ListItem key={skillIndex}>
                                <ListItemIcon>
                                  <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={skill} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Salary Range:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {rec.salary_range}
                          </Typography>
                          
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Growth Prospects:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {rec.growth_prospects}
                          </Typography>
                          
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Personality Fit:
                          </Typography>
                          <Typography variant="body2">
                            {rec.personality_fit}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Education Path:
                      </Typography>
                      <List>
                        {rec.education_path.map((path, pathIndex) => (
                          <ListItem key={pathIndex}>
                            <ListItemIcon>
                              <SchoolIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={path} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">
          Complete the assessment to receive personalized career recommendations.
        </Alert>
      )}
    </Box>
  );

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          py: 15,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Typography variant="h1" sx={{ fontWeight: 800, mb: 3 }}>
                AI-Powered <span style={{ color: '#ffd700' }}>Career Guidance</span>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Discover your ideal career path through comprehensive personality assessment,
                skills evaluation, and AI-driven recommendations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<PsychologyIcon />} label="Personality Analysis" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<AssessmentIcon />} label="Skills Assessment" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<TrendingUpIcon />} label="Growth Prediction" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  component="img"
                  src="/images/Career.gif" 
                  alt="AI-Powered Career Guidance"
                  sx={{ 
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'all 0.8s ease',
                    animation: 'float-career 6s ease-in-out infinite',
                    '@keyframes float-career': {
                      '0%': { transform: 'perspective(1000px) rotateY(-5deg) translateY(0)' },
                      '50%': { transform: 'perspective(1000px) rotateY(-2deg) translateY(-15px)' },
                      '100%': { transform: 'perspective(1000px) rotateY(-5deg) translateY(0)' }
                    },
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(255, 215, 0, 0.25)',
                      filter: 'brightness(1.05)'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Assessment Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
            Career Assessment Journey
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label} completed={isStepComplete(index)}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ minHeight: 400 }}>
                {activeStep === 0 && renderPersonalInfoStep()}
                {activeStep === 1 && renderPersonalityStep()}
                {activeStep === 2 && renderSkillsStep()}
                {activeStep === 3 && renderRecommendationsStep()}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Box>
                  {activeStep < 3 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!isStepComplete(activeStep) || loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                      {activeStep === 2 ? 'Generate Recommendations' : 'Next'}
                    </Button>
                  )}
                  {activeStep === 3 && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(0);
                        setRecommendations([]);
                        setPersonalityAnswers({});
                        setSkillAssessments([]);
                        setPersonalInfo({ name: '', age: '', education_level: '', interests: [] });
                      }}
                    >
                      Start New Assessment
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default CareerGuidance; 