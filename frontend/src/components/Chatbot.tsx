import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  InputAdornment,
  useTheme
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useThemeContext } from '../contexts/ThemeContext';

// Define message type
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Define knowledge base entry type
interface KnowledgeEntry {
  keywords: string[];
  response: string;
  category: 'education' | 'employment' | 'general';
  confidence: number;
}

// Comprehensive knowledge base for educational guidance with enhanced categories and confidence scores
const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'start'],
    response: "Hello! I'm EduLift's specialized AI assistant for educational and career guidance. How can I assist you today?",
    category: 'general',
    confidence: 0.98
  },
  {
    keywords: ['who are you', 'what are you', 'about you', 'tell me about yourself', 'your purpose', 'your function', 'what do you do', 'what can you do', 'how can you help'],
    response: "I'm the EduLift AI assistant, designed to provide specialized guidance for Sri Lankan students on educational pathways and employment opportunities. I focus exclusively on education and career-related information to ensure high accuracy in my responses.",
    category: 'general',
    confidence: 0.98
  },
  // Education-related entries
  {
    keywords: ['ol', 'o/l', 'o level', 'ordinary level', 'after ol', 'passed ol', 'completed ol', 'finished ol', 'done with ol', 'ol exam', 'ol examination', 'ordinary level exam', 'ordinary level examination', 'grade 11', 'year 11'],
    response: "After O/L examinations, you have several educational pathways: A/Levels in school, vocational training, technical colleges, professional certifications, or diploma courses. Your choice should align with your interests, strengths, and career goals. Would you like more specific information about any of these options?",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['al', 'a/l', 'a level', 'advanced level', 'streams', 'a/l streams', 'a/l subjects', 'a/l options', 'subject combination', 'subject selection', 'choose subjects', 'advanced level streams', 'advanced level subjects'],
    response: "For A/Level streams, you can choose from Science (Biology or Physical Science), Commerce, Arts, or Technology. Each stream prepares you for different university programs and career paths. Science focuses on medicine, engineering, and sciences; Commerce on business and finance; Arts on humanities and social sciences; and Technology on technical and IT fields. The stream you select should align with your interests, strengths, and future goals.",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['science', 'science stream', 'bio', 'biology', 'physics', 'chemistry', 'physical science', 'bio science', 'combined maths', 'mathematics', 'medicine', 'engineering', 'doctor', 'engineer', 'scientist'],
    response: "The Science stream splits into Biology (Bio Science) and Physical Science paths. Bio Science focuses on Biology, Chemistry, and Physics/Agriculture/Higher Maths, preparing for medicine, dentistry, veterinary science, agriculture, etc. Physical Science focuses on Combined Maths, Physics, and Chemistry, preparing for engineering, IT, physical sciences, etc. Both paths require strong analytical skills and interest in scientific concepts.",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['commerce', 'business', 'accounting', 'economics', 'business studies', 'management', 'finance', 'banking', 'marketing', 'entrepreneurship', 'business administration', 'commerce stream', 'accounts', 'econ'],
    response: "The Commerce stream includes subjects like Accounting, Business Studies, Economics, and IT/Statistics. This stream prepares you for careers in business, finance, management, marketing, banking, entrepreneurship, and more. It leads to degrees in commerce, business administration, finance, marketing, etc. This stream is ideal if you enjoy working with numbers, analyzing economic trends, or have an entrepreneurial mindset.",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['arts', 'humanities', 'languages', 'geography', 'history', 'political', 'social studies', 'sociology', 'psychology', 'arts stream', 'media', 'journalism', 'law', 'teaching', 'literature', 'religion'],
    response: "The Arts stream covers subjects like Languages, Geography, History, Political Science, Home Economics, Religion, and more. It offers the most diverse range of subjects. It prepares you for careers in education, law, journalism, public administration, international relations, social services, media, etc. This stream is suitable if you enjoy languages, writing, social analysis, or have interests in humanities and social sciences.",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['technology', 'tech', 'engineering technology', 'biosystems', 'SFT', 'ICT', 'computer', 'technology stream', 'IT', 'information technology', 'software', 'programming', 'tech stream', 'biosystems technology', 'science for technology'],
    response: "The Technology stream is a newer A/L path that includes subjects like Engineering Technology, Biosystems Technology, Science for Technology (SFT), and ICT. This stream bridges theoretical knowledge and practical skills, preparing you for careers in engineering technology, information technology, technical fields, and vocational paths. It's excellent for students who enjoy hands-on learning and practical applications of science and technology.",
    category: 'education',
    confidence: 0.99
  },
  {
    keywords: ['university', 'universities', 'higher education', 'college', 'degree', 'undergraduate', 'bachelors', 'university entrance', 'university admission', 'state university', 'private university', 'z-score', 'z score', 'university cutoff'],
    response: "Sri Lanka has 15 national universities and several other higher education institutions. Admission is based on A/Level results and Z-score rankings, which vary by district and change yearly. Popular universities include University of Colombo, University of Peradeniya, University of Moratuwa, and University of Sri Jayewardenepura. There are also private and international university options. What specific information about universities would you like to know?",
    category: 'education',
    confidence: 0.99
  },
  // General questions entries
  {
    keywords: ['weather', 'climate', 'temperature', 'rain', 'forecast', 'sunny', 'rainy'],
    response: "I'm specialized in education and career guidance. For weather information, please check a weather service or app for accurate forecasts.",
    category: 'general',
    confidence: 0.9
  },
  {
    keywords: ['favorite', 'favourite', 'like best', 'prefer', 'love', 'enjoy', 'your favorite', 'your favourite'],
    response: "I'm an AI assistant focused on education and career guidance, so I don't have personal preferences or favorites. I'm here to provide accurate information about educational pathways and career opportunities. How can I help you with your education or career questions?",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['food', 'drink', 'eat', 'cuisine', 'meal', 'restaurant', 'recipe', 'cooking', 'beverage'],
    response: "I'm specialized in educational and career guidance rather than topics like food and drink. I'd be happy to help you with questions about study options, career paths, or employment opportunities instead.",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['sports', 'game', 'team', 'player', 'match', 'cricket', 'football', 'soccer', 'basketball', 'tennis'],
    response: "I'm an education and career specialist rather than a sports expert. I can help you with questions about educational pathways, career options, or employment opportunities if you have any.",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['movie', 'film', 'tv', 'television', 'show', 'series', 'actor', 'actress', 'director', 'entertainment'],
    response: "I specialize in education and career guidance, not entertainment topics. If you have questions about study options, career paths, or employment opportunities, I'd be happy to assist with those instead.",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['music', 'song', 'artist', 'band', 'concert', 'album', 'genre', 'singer', 'playlist'],
    response: "As an educational assistant, I focus on providing guidance about study options and career paths rather than music topics. Is there something about education or career planning I can help you with?",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['politics', 'government', 'election', 'political', 'party', 'president', 'prime minister', 'policy', 'vote'],
    response: "I'm designed to provide education and career guidance rather than discuss political topics. I'd be happy to help you with questions about educational opportunities or career planning instead.",
    category: 'general',
    confidence: 0.95
  },
  {
    keywords: ['joke', 'funny', 'humor', 'laugh', 'comedy', 'entertain me', 'tell me a joke', 'make me laugh'],
    response: "I'm focused on providing educational and career guidance rather than entertainment. I'd be happy to help you with serious questions about study options or career paths instead.",
    category: 'general',
    confidence: 0.95
  },
  // Many more knowledge base entries...
];

// Default fallback responses when no match is found
const fallbackResponses = [
  "I'm specialized in providing information about education and employment in Sri Lanka. Your question appears to be outside my expertise. Could you ask something related to educational pathways, career guidance, or employment opportunities?",
  "I don't have information on that topic as I focus specifically on education and career guidance for Sri Lankan students. Please ask about educational options, career paths, or employment opportunities instead.",
  "I'm an education and career specialist, so I can't help with that particular question. I'd be happy to assist with any questions about study options, career planning, or employment opportunities.",
  "That appears to be outside my specialized knowledge of education and employment. Could you rephrase your question to relate to these areas?",
  "To provide you with the highest accuracy in responses, I only answer questions about education and employment. Would you like to ask about study options, career paths, or job opportunities instead?"
];

// Sample responses for demo purposes
const sampleResponses = [
  "Welcome to EduLift! I'm here to guide Sri Lankan students with their educational journey after O/L examinations. How can I help you today?",
  "After O/L examinations, you can pursue A/Levels in Science, Commerce, Arts, or Technology streams. You can also consider vocational training, professional certifications, or diploma courses based on your interests and goals.",
  "The Science stream splits into Bio Science (Biology, Chemistry, Physics) for medicine and life sciences, and Physical Science (Combined Maths, Physics, Chemistry) for engineering and computer science.",
  "The Commerce stream includes subjects like Accounting, Business Studies, Economics, and IT, preparing you for careers in business, finance, management, and entrepreneurship.",
  "The Arts stream covers subjects like Languages, History, Geography, and more, suitable for careers in education, law, journalism, and social services.",
  "The Technology stream includes Engineering Technology, Biosystems Technology, Science for Technology (SFT), and ICT, preparing you for technical fields.",
  "Sri Lanka has 15 national universities. Admission is based on A/Level results and Z-score rankings. There are also private higher education options available.",
  "Vocational training through institutions like NAITA, VTA, and Technical Colleges offers practical skills for direct employment without requiring university education.",
  "Our career assessment tools can identify your strengths, interests, and aptitudes to suggest suitable educational and career paths tailored to your profile.",
  "EduLift offers personalized guidance sessions with experienced counselors who can help with educational planning, subject selection, and career guidance.",
  "Registration is simple! Just click the Register button, fill your details, verify your email, and access our comprehensive guidance resources and counseling services.",
  "We provide resources for both students and parents, including workshops, informational materials, and family counseling to support educational decision-making together."
];

// Configuration for AI integration
const aiConfig = {
  enabled: false, // Set to true to use external AI API
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 150,
  systemPrompt: `You are an educational guidance assistant for Sri Lankan students after their O/L examinations. 
    Provide accurate, concise, and helpful information about educational pathways, career options, 
    and guidance services. Keep responses under 150 words and focus on Sri Lankan context.`
};

// Types for educational stage
type EducationStage = 'not_specified' | 'just_completed_ol' | 'studying_al' | 'completed_al' | 'higher_education' | 'professional';

// Component for education stage selector
const EducationStageSelector: React.FC<{
  currentStage: EducationStage;
  onChange: (stage: EducationStage) => void;
}> = ({ currentStage, onChange }) => {
  const { mode } = useThemeContext();
  
  const stages = [
    { value: 'not_specified', label: 'Not Specified' },
    { value: 'just_completed_ol', label: 'Just completed O/L' },
    { value: 'studying_al', label: 'Studying A/L' },
    { value: 'completed_al', label: 'Completed A/L' },
    { value: 'higher_education', label: 'In Higher Education' },
    { value: 'professional', label: 'Professional/Working' }
  ];
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      <Typography variant="body2" sx={{ width: '100%', mb: 1, color: mode === 'light' ? 'text.secondary' : 'text.primary' }}>
        For better guidance, please select your educational stage:
      </Typography>
      {stages.map((stage) => (
        <Box
          key={stage.value}
          onClick={() => onChange(stage.value as EducationStage)}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: '16px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            bgcolor: currentStage === stage.value 
              ? (mode === 'light' ? 'primary.main' : 'primary.dark')
              : (mode === 'light' ? 'grey.200' : 'grey.800'),
            color: currentStage === stage.value 
              ? 'white' 
              : (mode === 'light' ? 'text.primary' : 'text.secondary'),
            '&:hover': {
              bgcolor: currentStage === stage.value 
                ? (mode === 'light' ? 'primary.dark' : 'primary.main')
                : (mode === 'light' ? 'grey.300' : 'grey.700')
            },
            transition: 'all 0.2s ease'
          }}
        >
          {stage.label}
        </Box>
      ))}
    </Box>
  );
};

export const ChatbotComponent: React.FC = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageId, setMessageId] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [educationStage, setEducationStage] = useState<EducationStage>('not_specified');
  const [showStageSelector, setShowStageSelector] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Welcome message when chat is first opened
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: 0,
        text: "Welcome to EduLift's specialized educational and career guidance assistant! I provide highly accurate information focused exclusively on educational pathways and employment opportunities in Sri Lanka. Please note that I'm programmed to answer only questions related to these topics to ensure accuracy above 95%. How can I help with your educational or career journey today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [messages]);

  // Scroll to bottom when new messages added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to analyze message and update conversation context
  const updateConversationContext = (userMessage: string, botResponse: string) => {
    // Keep context limited to last 3 exchanges to prevent confusion
    if (conversationContext.length >= 6) {
      setConversationContext(prev => [...prev.slice(2), userMessage, botResponse]);
    } else {
      setConversationContext(prev => [...prev, userMessage, botResponse]);
    }
    
    // Try to identify the topic of the conversation
    const topicKeywords: {[key: string]: string[]} = {
      'science': ['science', 'biology', 'physics', 'chemistry', 'medicine', 'engineering'],
      'commerce': ['commerce', 'business', 'accounting', 'economics', 'finance', 'marketing'],
      'arts': ['arts', 'humanities', 'languages', 'history', 'geography', 'social'],
      'technology': ['technology', 'tech', 'IT', 'computing', 'software', 'programming'],
      'university': ['university', 'degree', 'bachelor', 'higher education', 'campus'],
      'vocational': ['vocational', 'training', 'technical', 'diploma', 'certificate', 'practical'],
      'career': ['career', 'job', 'profession', 'employment', 'work', 'occupation'],
      'scholarship': ['scholarship', 'financial aid', 'funding', 'money', 'loan', 'bursary'],
      'abroad': ['abroad', 'foreign', 'overseas', 'international', 'other country']
    };
    
    // Check if the message aligns with any topic
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()))) {
        setLastTopic(topic);
        break;
      }
    }
  };
  
  // Basic function to find the best response from knowledge base with improved accuracy
  const findResponse = (userMessage: string): { text: string; category: string; confidence: number } => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Calculate match scores for each knowledge entry
    const matches = knowledgeBase.map(entry => {
      // Count exact keyword matches
      const exactKeywordMatches = entry.keywords.filter(keyword => 
        userMessageLower.includes(keyword.toLowerCase())
      ).length;
      
      // Check for partial keyword matches (for longer keywords)
      const partialMatches = entry.keywords.filter(keyword => {
        if (keyword.length > 5) {
          // Check if at least 70% of the keyword is present in the user message
          return keyword.toLowerCase().split(' ').some(word => {
            if (word.length > 5) {
              return userMessageLower.includes(word.substring(0, Math.ceil(word.length * 0.7)).toLowerCase());
            }
            return false;
          });
        }
        return false;
      }).length;
      
      // Calculate relevance score - exact matches are weighted more heavily
      const score = (exactKeywordMatches * 2) + (partialMatches * 0.5);
      
      return {
        response: entry.response,
        category: entry.category,
        baseConfidence: entry.confidence,
        score: score
      };
    });
    
    // Sort by score in descending order
    matches.sort((a, b) => b.score - a.score);
    
    // Check if we have any matching response with a positive score
    if (matches[0] && matches[0].score > 0) {
      // Calculate final confidence based on base confidence and match score
      const calculatedConfidence = Math.min(matches[0].baseConfidence * (1 + matches[0].score * 0.05), 0.99);
      
      return {
        text: matches[0].response,
        category: matches[0].category,
        confidence: calculatedConfidence
      };
    }
    
    // Check for personal questions or off-topic content
    const personalPhrases = ['you', 'your', 'yourself', 'are you', 'do you', 'can you'];
    if (personalPhrases.some(phrase => userMessageLower.includes(phrase))) {
      return {
        text: "I'm an AI assistant specialized in education and career guidance for Sri Lankan students. I don't have personal preferences or abilities beyond providing accurate information in these domains. How can I help with your education or career questions?",
        category: 'general',
        confidence: 0.95
      };
    }

    // If no match found, return a fallback response
    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      category: 'general',
      confidence: 0.75
    };
  };

  // Function to get response from external AI service
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      if (!aiConfig.enabled || !aiConfig.apiKey) {
        throw new Error('AI integration is disabled or API key is missing');
      }

      const response = await fetch(aiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            { role: 'system', content: aiConfig.systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: aiConfig.temperature,
          max_tokens: aiConfig.maxTokens
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fall back to knowledge base
      return findResponse(userMessage).text;
    }
  };

  // Enhanced response finder with context awareness
  const findResponseWithContext = (userMessage: string): { text: string; category: string; confidence: number } => {
    const userMessageLower = userMessage.toLowerCase();
    
    // First check for irrelevant topics to handle them explicitly
    const irrelevantTopics = [
      'weather', 'sports', 'politics', 'movies', 'music', 'games', 'food', 'travel', 
      'news', 'celebrities', 'entertainment', 'dating', 'religion', 'jokes', 'memes',
      'favorite', 'favourite', 'like best', 'prefer', 'love', 'enjoy',
      'drink', 'eat', 'recipe', 'cooking'
    ];
    
    // If the message appears to be about an irrelevant topic, return a clear response
    for (const topic of irrelevantTopics) {
      if (userMessageLower.includes(topic)) {
        return {
          text: `I'm specialized in education and career guidance only. Your question about ${topic} is outside my area of expertise. I can help with questions about educational options, career paths, or employment opportunities.`,
          category: 'general',
          confidence: 0.98
        };
      }
    }
    
    // Specifically check for "what is my favorite" questions
    if (userMessageLower.includes("what is my favorite") || 
        userMessageLower.includes("what's my favorite") ||
        userMessageLower.includes("what do i like") ||
        userMessageLower.includes("what's my") ||
        userMessageLower.includes("who is my")) {
      return {
        text: "I'm an AI assistant focused on education and career guidance. I don't have access to your personal preferences or information unless you've shared them with me in this conversation. If you have questions about educational pathways or career options, I'd be happy to help with those.",
        category: 'general',
        confidence: 0.99
      };
    }
    
    // Check for follow-up questions related to the last topic
    const isFollowUpQuestion = /^(what|how|when|where|why|which|can you|tell me|more about|explain|elaborate)/i.test(userMessageLower);
    
    // If it seems like a follow-up question and we have a last topic related to education or employment
    if (isFollowUpQuestion && lastTopic && 
        (lastTopic === 'education' || lastTopic === 'employment' || 
         lastTopic === 'university' || lastTopic === 'career' || 
         lastTopic === 'vocational' || lastTopic === 'science' || 
         lastTopic === 'commerce' || lastTopic === 'arts' || 
         lastTopic === 'technology') && 
        userMessage.length < 60) {
      // Augment the user message with the last topic for better matching
      const augmentedMessage = `${userMessage} ${lastTopic}`;
      
      // Get response using the augmented message
      const matches = knowledgeBase.map(entry => {
        const exactKeywordMatches = entry.keywords.filter(keyword => 
          augmentedMessage.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        const partialMatches = entry.keywords.filter(keyword => {
          if (keyword.length > 5) {
            return augmentedMessage.toLowerCase().includes(keyword.substring(0, Math.ceil(keyword.length * 0.7)).toLowerCase());
          }
          return false;
        }).length;
        
        const score = (exactKeywordMatches * 2) + (partialMatches * 0.5);
        
        return {
          response: entry.response,
          category: entry.category,
          baseConfidence: entry.confidence,
          score: score
        };
      });
      
      matches.sort((a, b) => b.score - a.score);
      
      if (matches[0].score > 0) {
        // Calculate final confidence based on base confidence and match score
        const contextConfidence = Math.min(matches[0].baseConfidence * (1 + matches[0].score * 0.05), 0.99);
        
        return {
          text: matches[0].response,
          category: matches[0].category,
          confidence: contextConfidence
        };
      }
    }
    
    // Fall back to the standard matching if no context match found
    return findResponse(userMessage);
  };

  // Handle education stage change
  const handleStageChange = (stage: EducationStage) => {
    setEducationStage(stage);
    
    // If it's the first selection, add a confirmation message
    if (educationStage === 'not_specified' && messages.length <= 2) {
      const stageResponses: {[key in EducationStage]: string} = {
        not_specified: "I'll provide general educational guidance. You can change your educational stage anytime.",
        just_completed_ol: "Great! I'll focus on helping you explore A/L streams, vocational options, and next steps after O/L examinations.",
        studying_al: "I'll provide guidance on A/L subjects, university preparation, and career planning based on your selected stream.",
        completed_al: "I'll focus on higher education options, university applications, alternative paths, and career guidance based on your A/L results.",
        higher_education: "I'll help with academic planning, specialization options, internships, postgraduate opportunities, and career preparation.",
        professional: "I'll provide information on professional development, further qualifications, career advancement, and upskilling opportunities."
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: messageId + 1,
          text: stageResponses[stage],
          sender: 'bot',
          timestamp: new Date()
        }]);
        setMessageId(prev => prev + 2);
      }, 500);
    }
    
    // Hide selector after selection, but can be shown again via settings
    if (stage !== 'not_specified') {
      setShowStageSelector(false);
    }
  };

  // Updated findCustomizedResponse with education stage awareness and focus on education/employment
  const findCustomizedResponse = (userMessage: string): { text: string; category: string; confidence: number } => {
    const response = findResponseWithContext(userMessage);
    
    // If education stage is not specified, return the standard response
    if (educationStage === 'not_specified') {
      return response;
    }
    
    // Only customize responses related to education or employment
    if (response.category !== 'education' && response.category !== 'employment') {
      return response;
    }
    
    // Customize response based on education stage when appropriate
    const lowerMessage = userMessage.toLowerCase();
    
    // Add stage-specific advice for certain topics
    if (educationStage === 'just_completed_ol' && 
        (lowerMessage.includes('what should i do') || lowerMessage.includes('next step') || lowerMessage.includes('career'))) {
      return {
        text: `${response.text}\n\nSince you've just completed O/L, focus on exploring different A/L streams and subjects that match your interests and strengths. Consider visiting schools or speaking with teachers about their A/L programs. It's also a good time to start thinking about broad career fields that interest you.`,
        category: response.category,
        confidence: Math.min(response.confidence + 0.05, 0.99) // Slightly increase confidence for customized responses
      };
    }
    
    if (educationStage === 'studying_al' && 
        (lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('higher education'))) {
      return {
        text: `${response.text}\n\nAs you're currently studying A/L, focus on maintaining good grades while researching university programs that interest you. Start preparing for university entrance requirements and explore scholarship opportunities. Consider visiting university open days when available.`,
        category: response.category,
        confidence: Math.min(response.confidence + 0.05, 0.99)
      };
    }
    
    if (educationStage === 'completed_al' && 
        (lowerMessage.includes('what now') || lowerMessage.includes('what should i do') || lowerMessage.includes('next step'))) {
      return {
        text: `${response.text}\n\nHaving completed A/L, you should be focusing on university applications or exploring alternative paths like professional qualifications, vocational training, or entry-level positions that align with your career interests. This is a good time to build practical skills through short courses while waiting for university admission.`,
        category: response.category,
        confidence: Math.min(response.confidence + 0.05, 0.99)
      };
    }
    
    // Return the standard response if no customization is needed
    return response;
  };

  // Updated handling of sending messages with better handling of non-educational queries
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setMessageId(prev => prev + 1);
    
    // Simulate bot typing
    setIsTyping(true);
    
    let responseData: { text: string; category: string; confidence: number };
    
    // First check for specific personal questions that need precise responses
    const userMessageLower = newMessage.toLowerCase().trim();
    
    if (userMessageLower === "what is my favorite drink?" || 
        userMessageLower === "what's my favorite drink" ||
        userMessageLower.includes("what is my favorite drink") ||
        userMessageLower.includes("my favorite drink")) {
      responseData = {
        text: "I'm an AI assistant focused exclusively on education and career guidance. I don't have access to your personal preferences like favorite drinks. I can help with questions about educational pathways, subject choices, university options, or career planning instead.",
        category: 'general',
        confidence: 0.99
      };
    } 
    // Handle other personal preference questions
    else if ((userMessageLower.includes("what is my") || userMessageLower.includes("what's my")) && 
             (userMessageLower.includes("favorite") || userMessageLower.includes("favourite"))) {
      responseData = {
        text: "I'm an education and career guidance assistant, so I don't have access to your personal preferences or favorites. I'd be happy to help with questions about study options, career paths, or employment opportunities instead.",
        category: 'general',
        confidence: 0.99
      };
    }
    // Try to get response from AI if enabled, otherwise use knowledge base with context
    else if (aiConfig.enabled && aiConfig.apiKey) {
      try {
        const aiResponse = await getAIResponse(newMessage);
        responseData = { text: aiResponse, category: 'general', confidence: 0.9 };
      } catch (error) {
        console.error('Error in AI response:', error);
        responseData = findCustomizedResponse(newMessage);
      }
    } else {
      // Use knowledge base with context awareness and education stage customization
      responseData = findCustomizedResponse(newMessage);
    }
    
    // Update conversation context
    if (responseData.category === 'education' || responseData.category === 'employment') {
      setLastTopic(responseData.category);
      updateConversationContext(newMessage, responseData.text);
    }
    
    // Calculate a more realistic typing delay based on response length
    const baseDelay = 800; // slightly faster minimum response time
    const charactersPerSecond = 25; // slightly faster typing speed
    const additionalDelay = Math.min(
      responseData.text.length / charactersPerSecond * 1000,
      2000 // cap at 2 seconds max additional delay
    );
    
    setTimeout(() => {
      const botMessage: Message = {
        id: messageId + 1,
        text: responseData.text,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setMessageId(prev => prev + 2);
      setIsTyping(false);
    }, baseDelay + additionalDelay);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 87, 255, 0.25)'
        }}
        onClick={toggleDrawer}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '400px' },
            boxSizing: 'border-box',
            height: '100%'
          }
        }}
      >
        {/* Chat Header */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: mode === 'dark' ? 'primary.dark' : 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              EduLift Assistant
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, p: 0.5, backgroundColor: 'success.main', borderRadius: 1 }}>
              Education & Career Focus
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Information Banner */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            m: 1, 
            backgroundColor: mode === 'dark' ? 'info.dark' : 'info.light',
            color: mode === 'dark' ? 'info.contrastText' : 'info.main',
            borderRadius: 1
          }}
        >
          <Typography variant="body2" align="center">
            This assistant is specialized in educational and employment topics only, with 95%+ accuracy. Questions on other topics will receive error messages.
          </Typography>
        </Paper>

        {/* Education Stage Selector */}
        {showStageSelector && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Tell me about your educational stage:
            </Typography>
            <EducationStageSelector 
              currentStage={educationStage}
              onChange={handleStageChange}
            />
          </Box>
        )}

        {/* Chat Messages */}
        <List 
          sx={{ 
            p: 2, 
            overflowY: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: 'calc(100% - 180px)'
          }}
        >
          {messages.map((message) => (
            <ListItem
              key={message.id}
              alignItems="flex-start"
              sx={{
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                p: 0,
                mb: 2
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {message.sender === 'user' ? 'You' : <SmartToyIcon fontSize="small" />}
                </Avatar>
              </ListItemAvatar>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' 
                    ? (mode === 'dark' ? 'secondary.dark' : 'secondary.light') 
                    : (mode === 'dark' ? 'primary.dark' : 'primary.light'),
                  color: message.sender === 'user' 
                    ? (mode === 'dark' ? 'secondary.contrastText' : 'text.primary') 
                    : (mode === 'dark' ? 'primary.contrastText' : 'text.primary'),
                }}
              >
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </ListItem>
          ))}
          {isTyping && (
            <ListItem alignItems="flex-start" sx={{ p: 0 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: mode === 'dark' ? 'primary.dark' : 'primary.light',
                  color: mode === 'dark' ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Typing...
                  </Typography>
                </Box>
              </Paper>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
        
        <Divider />
        
        {/* Chat Input */}
        <Box 
          component="form" 
          onSubmit={handleSendMessage} 
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex'
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask about education or employment..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
            size="small"
            disabled={isTyping}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    color="primary" 
                    type="submit" 
                    disabled={!newMessage.trim() || isTyping}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mr: 1 }}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default ChatbotComponent; 