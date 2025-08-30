import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiObjects as EmojiObjectsIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  MusicNote as MusicNoteIcon,
  SportsSoccer as SportsIcon,
  Calculate as MathIcon,
  Language as LanguageIcon,
  Brush as ArtIcon,
  Nature as NatureIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

interface AptitudeQuestion {
  id: string;
  question: string;
  type: 'logical' | 'verbal' | 'numerical' | 'spatial' | 'abstract';
  options: string[];
  correct_answer: number;
}

interface TalentRecommendation {
  talent_area: string;
  strength_percentage: number;
  description: string;
  development_suggestions: string[];
  career_opportunities: string[];
  learning_resources: string[];
  intelligence_types: string[];
}

const TalentIdentification = () => {
  const { mode } = useThemeContext();
  const [activeStep, setActiveStep] = useState(0);
  const [aptitudeAnswers, setAptitudeAnswers] = useState<{[key: string]: number}>({});
  const [intelligenceScores, setIntelligenceScores] = useState<{[key: string]: number}>({});
  const [personalPreferences, setPersonalPreferences] = useState<{[key: string]: number}>({});
  const [talentRecommendations, setTalentRecommendations] = useState<TalentRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const steps = [
    'Aptitude Assessment',
    'Multiple Intelligence Evaluation',
    'Interest & Preference Analysis',
    'Talent Profile & Recommendations'
  ];

  const aptitudeQuestions: AptitudeQuestion[] = [
    {
      id: '1',
      question: 'If 3x + 7 = 22, what is the value of x?',
      type: 'numerical',
      options: ['3', '5', '7', '9'],
      correct_answer: 1
    },
    {
      id: '2',
      question: 'Complete the pattern: 2, 6, 18, 54, ?',
      type: 'logical',
      options: ['108', '162', '216', '270'],
      correct_answer: 1
    },
    {
      id: '3',
      question: 'Which word is most similar to "Abundant"?',
      type: 'verbal',
      options: ['Scarce', 'Plentiful', 'Limited', 'Rare'],
      correct_answer: 1
    },
    {
      id: '4',
      question: 'How many small cubes are needed to build a 4x4x4 cube?',
      type: 'spatial',
      options: ['16', '32', '48', '64'],
      correct_answer: 3
    },
    {
      id: '5',
      question: 'Which shape comes next in the sequence: ○, △, □, ○, △, ?',
      type: 'abstract',
      options: ['○', '△', '□', '◇'],
      correct_answer: 2
    }
  ];

  const multipleIntelligences = [
    {
      type: 'Linguistic',
      description: 'Understanding and using language effectively',
      icon: <LanguageIcon />,
      questions: [
        'I enjoy reading books and writing stories',
        'I find it easy to remember quotes and sayings',
        'I like to play word games and solve crosswords'
      ]
    },
    {
      type: 'Logical-Mathematical',
      description: 'Working with numbers, patterns, and logical reasoning',
      icon: <MathIcon />,
      questions: [
        'I enjoy solving math problems and puzzles',
        'I can easily see patterns in numbers and data',
        'I like to analyze and categorize information'
      ]
    },
    {
      type: 'Spatial-Visual',
      description: 'Understanding visual and spatial information',
      icon: <ArtIcon />,
      questions: [
        'I can easily visualize objects in 3D space',
        'I enjoy drawing, painting, or designing',
        'I have a good sense of direction and navigation'
      ]
    },
    {
      type: 'Musical',
      description: 'Understanding and creating music',
      icon: <MusicNoteIcon />,
      questions: [
        'I can easily recognize different musical patterns',
        'I enjoy singing or playing musical instruments',
        'I often have songs playing in my head'
      ]
    },
    {
      type: 'Bodily-Kinesthetic',
      description: 'Using physical movement and coordination',
      icon: <SportsIcon />,
      questions: [
        'I learn best through hands-on activities',
        'I enjoy sports and physical activities',
        'I have good coordination and balance'
      ]
    },
    {
      type: 'Interpersonal',
      description: 'Understanding and working with others',
      icon: <GroupIcon />,
      questions: [
        'I enjoy working in teams and groups',
        'I can easily understand others\' feelings',
        'I like to help resolve conflicts between people'
      ]
    },
    {
      type: 'Intrapersonal',
      description: 'Understanding yourself and self-reflection',
      icon: <PsychologyIcon />,
      questions: [
        'I enjoy spending time alone thinking',
        'I understand my own emotions well',
        'I like to set personal goals and work towards them'
      ]
    },
    {
      type: 'Naturalist',
      description: 'Understanding nature and environmental patterns',
      icon: <NatureIcon />,
      questions: [
        'I enjoy being outdoors in nature',
        'I can easily identify plants and animals',
        'I notice patterns in weather and natural phenomena'
      ]
    }
  ];

  const interestAreas = [
    { name: 'Science & Technology', category: 'STEM' },
    { name: 'Arts & Creativity', category: 'Creative' },
    { name: 'Sports & Athletics', category: 'Physical' },
    { name: 'Social Work & Helping Others', category: 'Social' },
    { name: 'Business & Entrepreneurship', category: 'Business' },
    { name: 'Music & Performance', category: 'Creative' },
    { name: 'Research & Analysis', category: 'Academic' },
    { name: 'Leadership & Management', category: 'Leadership' },
    { name: 'Teaching & Education', category: 'Social' },
    { name: 'Health & Medicine', category: 'Healthcare' }
  ];

  const handleAptitudeAnswer = (questionId: string, answerIndex: number) => {
    setAptitudeAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleIntelligenceScore = (intelligenceType: string, questionIndex: number, score: number) => {
    const key = `${intelligenceType}_${questionIndex}`;
    setIntelligenceScores(prev => ({ ...prev, [key]: score }));
  };

  const handlePreferenceChange = (area: string, value: number) => {
    setPersonalPreferences(prev => ({ ...prev, [area]: value }));
  };

  const generateTalentProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const aptitudeResults = Object.entries(aptitudeAnswers).map(([questionId, answer]) => {
        const question = aptitudeQuestions.find(q => q.id === questionId);
        return {
          question_id: questionId,
          answer: answer,
          correct: question ? (answer === question.correct_answer) : false,
          type: question?.type || 'unknown'
        };
      });

      const intelligenceResults = multipleIntelligences.map(intelligence => {
        const scores = [0, 1, 2].map(i => intelligenceScores[`${intelligence.type}_${i}`] || 0);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return {
          type: intelligence.type,
          score: averageScore,
          description: intelligence.description
        };
      });

      const assessmentData = {
        aptitude_results: aptitudeResults,
        intelligence_scores: intelligenceResults,
        personal_preferences: personalPreferences
      };

      const response = await axios.post('http://localhost:5000/api/talent-identification/analyze', assessmentData);
      setTalentRecommendations(response.data.recommendations);
      setActiveStep(3);
    } catch (err: any) {
      setError('Failed to generate talent profile. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      generateTalentProfile();
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
        return Object.keys(aptitudeAnswers).length === aptitudeQuestions.length;
      case 1:
        return Object.keys(intelligenceScores).length === multipleIntelligences.length * 3;
      case 2:
        return Object.keys(personalPreferences).length >= 5;
      default:
        return false;
    }
  };

  const renderAptitudeStep = () => {
    const currentQuestion = aptitudeQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / aptitudeQuestions.length) * 100;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Aptitude Assessment - Question {currentQuestionIndex + 1} of {aptitudeQuestions.length}
        </Typography>
        
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 4, height: 8, borderRadius: 4 }} />
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {currentQuestion.question}
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={aptitudeAnswers[currentQuestion.id] ?? ''}
                onChange={(e) => handleAptitudeAnswer(currentQuestion.id, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(aptitudeQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === aptitudeQuestions.length - 1}
                variant="contained"
              >
                Next Question
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        <Typography variant="body2" color="text.secondary">
          Question Type: {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)}
        </Typography>
      </Box>
    );
  };

  const renderIntelligenceStep = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Multiple Intelligence Assessment
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Rate each statement based on how well it describes you (1 = Not at all, 5 = Very much)
      </Typography>
      
      {multipleIntelligences.map((intelligence, intelligenceIndex) => (
        <Accordion key={intelligence.type} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {intelligence.icon}
              </Avatar>
              <Box>
                <Typography variant="h6">{intelligence.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {intelligence.description}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {intelligence.questions.map((question, questionIndex) => (
              <Box key={questionIndex} sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {question}
                </Typography>
                <Rating
                  value={intelligenceScores[`${intelligence.type}_${questionIndex}`] || 0}
                  onChange={(_, value) => handleIntelligenceScore(intelligence.type, questionIndex, value || 0)}
                  max={5}
                  size="large"
                />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderPreferencesStep = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Interest & Preference Analysis
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Rate your level of interest in each area (1 = No interest, 10 = Very high interest)
      </Typography>
      
      <Grid container spacing={3}>
        {interestAreas.map((area, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {area.name}
                </Typography>
                <Chip label={area.category} size="small" sx={{ mb: 2 }} />
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={personalPreferences[area.name] || 5}
                    onChange={(_, value) => handlePreferenceChange(area.name, value as number)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRecommendationsStep = () => (
    <Box>
      {talentRecommendations.length > 0 ? (
        <Grid container spacing={3}>
          {talentRecommendations.map((rec, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ border: index === 0 ? 2 : 1, borderColor: index === 0 ? 'primary.main' : 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <StarIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {rec.talent_area}
                        {index === 0 && <LightbulbIcon sx={{ color: 'gold', ml: 1 }} />}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {rec.strength_percentage}% Strength Match
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {rec.description}
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Development & Opportunities</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Development Suggestions:
                          </Typography>
                          <List dense>
                            {rec.development_suggestions.map((suggestion, suggestionIndex) => (
                              <ListItem key={suggestionIndex}>
                                <ListItemIcon>
                                  <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={suggestion} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Career Opportunities:
                          </Typography>
                          <List dense>
                            {rec.career_opportunities.map((opportunity, opportunityIndex) => (
                              <ListItem key={opportunityIndex}>
                                <ListItemIcon>
                                  <TrendingUpIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary={opportunity} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Intelligence Types Involved:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {rec.intelligence_types.map((type, typeIndex) => (
                          <Chip key={typeIndex} label={type} color="primary" variant="outlined" />
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Learning Resources:
                      </Typography>
                      <List dense>
                        {rec.learning_resources.map((resource, resourceIndex) => (
                          <ListItem key={resourceIndex}>
                            <ListItemIcon>
                              <SchoolIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={resource} />
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
          Complete the assessment to receive your personalized talent profile.
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
                AI-Powered <span style={{ color: '#ffd700' }}>Talent Identification</span>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Discover your unique talents and strengths through comprehensive aptitude testing,
                multiple intelligence assessment, and AI-driven analysis.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<AssessmentIcon />} label="Aptitude Testing" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<PsychologyIcon />} label="Multiple Intelligence" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip icon={<TrendingUpIcon />} label="Talent Development" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Box sx={{ textAlign: 'center' }}>
                <EmojiObjectsIcon sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Assessment Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
            Comprehensive Talent Assessment
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

              <Box sx={{ minHeight: 500 }}>
                {activeStep === 0 && renderAptitudeStep()}
                {activeStep === 1 && renderIntelligenceStep()}
                {activeStep === 2 && renderPreferencesStep()}
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
                      {activeStep === 2 ? 'Generate Talent Profile' : 'Next'}
                    </Button>
                  )}
                  {activeStep === 3 && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(0);
                        setTalentRecommendations([]);
                        setAptitudeAnswers({});
                        setIntelligenceScores({});
                        setPersonalPreferences({});
                        setCurrentQuestionIndex(0);
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

export default TalentIdentification; 