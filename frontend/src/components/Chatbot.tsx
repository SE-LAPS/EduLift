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
}

// Comprehensive knowledge base for educational guidance
const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'start'],
    response: "Hello! I'm EduLift's AI assistant, ready to help you with educational guidance. How can I assist you today?"
  },
  {
    keywords: ['who are you', 'what are you', 'about you', 'tell me about yourself', 'your purpose', 'your function', 'what do you do', 'what can you do', 'how can you help'],
    response: "I'm the EduLift AI assistant, designed to provide educational guidance for Sri Lankan students after their O/L examinations. I can help with subject selection, career paths, university options, vocational training, and educational opportunities. Just ask me anything related to your educational journey!"
  },
  {
    keywords: ['ol', 'o/l', 'o level', 'ordinary level', 'after ol', 'passed ol', 'completed ol', 'finished ol', 'done with ol', 'ol exam', 'ol examination', 'ordinary level exam', 'ordinary level examination', 'grade 11', 'year 11'],
    response: "After O/L examinations, you have several educational pathways: A/Levels in school, vocational training, technical colleges, professional certifications, or diploma courses. Your choice should align with your interests, strengths, and career goals. Would you like more specific information about any of these options?"
  },
  {
    keywords: ['al', 'a/l', 'a level', 'advanced level', 'streams', 'a/l streams', 'a/l subjects', 'a/l options', 'subject combination', 'subject selection', 'choose subjects', 'advanced level streams', 'advanced level subjects'],
    response: "For A/Level streams, you can choose from Science (Biology or Physical Science), Commerce, Arts, or Technology. Each stream prepares you for different university programs and career paths. Science focuses on medicine, engineering, and sciences; Commerce on business and finance; Arts on humanities and social sciences; and Technology on technical and IT fields. The stream you select should align with your interests, strengths, and future goals."
  },
  {
    keywords: ['science', 'science stream', 'bio', 'biology', 'physics', 'chemistry', 'physical science', 'bio science', 'combined maths', 'mathematics', 'medicine', 'engineering', 'doctor', 'engineer', 'scientist'],
    response: "The Science stream splits into Biology (Bio Science) and Physical Science paths. Bio Science focuses on Biology, Chemistry, and Physics/Agriculture/Higher Maths, preparing for medicine, dentistry, veterinary science, agriculture, etc. Physical Science focuses on Combined Maths, Physics, and Chemistry, preparing for engineering, IT, physical sciences, etc. Both paths require strong analytical skills and interest in scientific concepts."
  },
  {
    keywords: ['commerce', 'business', 'accounting', 'economics', 'business studies', 'management', 'finance', 'banking', 'marketing', 'entrepreneurship', 'business administration', 'commerce stream', 'accounts', 'econ'],
    response: "The Commerce stream includes subjects like Accounting, Business Studies, Economics, and IT/Statistics. This stream prepares you for careers in business, finance, management, marketing, banking, entrepreneurship, and more. It leads to degrees in commerce, business administration, finance, marketing, etc. This stream is ideal if you enjoy working with numbers, analyzing economic trends, or have an entrepreneurial mindset."
  },
  {
    keywords: ['arts', 'humanities', 'languages', 'geography', 'history', 'political', 'social studies', 'sociology', 'psychology', 'arts stream', 'media', 'journalism', 'law', 'teaching', 'literature', 'religion'],
    response: "The Arts stream covers subjects like Languages, Geography, History, Political Science, Home Economics, Religion, and more. It offers the most diverse range of subjects. It prepares you for careers in education, law, journalism, public administration, international relations, social services, media, etc. This stream is suitable if you enjoy languages, writing, social analysis, or have interests in humanities and social sciences."
  },
  {
    keywords: ['technology', 'tech', 'engineering technology', 'biosystems', 'SFT', 'ICT', 'computer', 'technology stream', 'IT', 'information technology', 'software', 'programming', 'tech stream', 'biosystems technology', 'science for technology'],
    response: "The Technology stream is a newer A/L path that includes subjects like Engineering Technology, Biosystems Technology, Science for Technology (SFT), and ICT. This stream bridges theoretical knowledge and practical skills, preparing you for careers in engineering technology, information technology, technical fields, and vocational paths. It's excellent for students who enjoy hands-on learning and practical applications of science and technology."
  },
  {
    keywords: ['university', 'universities', 'higher education', 'college', 'degree', 'undergraduate', 'bachelors', 'university entrance', 'university admission', 'state university', 'private university', 'z-score', 'z score', 'university cutoff'],
    response: "Sri Lanka has 15 national universities and several other higher education institutions. Admission is based on A/Level results and Z-score rankings, which vary by district and change yearly. Popular universities include University of Colombo, University of Peradeniya, University of Moratuwa, and University of Sri Jayewardenepura. There are also private and international university options. What specific information about universities would you like to know?"
  },
  {
    keywords: ['vocational', 'training', 'TVET', 'technical', 'skill', 'diploma', 'certificate', 'short course', 'practical training', 'apprenticeship', 'vocational education', 'NAITA', 'VTA', 'technical college', 'institute', 'professional qualification'],
    response: "Vocational training and technical education (TVET) are excellent alternatives to university education, especially if you prefer practical skills. Institutions like NAITA, VTA, Technical Colleges, DTET, and others offer various certificate and diploma courses in fields like IT, engineering, hospitality, beauty culture, construction, automotive, etc. These programs are more practical, job-oriented, and often shorter than university degrees, with good employment prospects."
  },
  {
    keywords: ['career', 'job', 'profession', 'occupation', 'employment', 'work', 'career path', 'career guidance', 'career counseling', 'job opportunities', 'career planning', 'future careers', 'employment opportunities', 'job market', 'career prospects', 'high demand careers', 'good salary'],
    response: "Career planning should align with your interests, skills, values, and personality. EduLift offers career assessment tools and counseling to help you discover suitable paths. When choosing a career, consider both your passions and market demand. Research growth industries in Sri Lanka like IT, tourism, healthcare, finance, and export manufacturing. We recommend exploring multiple options through research, talking to professionals, and seeking experiences through internships or volunteering before making final decisions."
  },
  {
    keywords: ['scholarship', 'financial', 'aid', 'funding', 'student loans', 'bursary', 'financial assistance', 'mahapola', 'free education', 'scholarship opportunities', 'financial support', 'education loan', 'merit scholarship', 'need-based scholarship', 'overseas scholarship'],
    response: "Various scholarships are available for Sri Lankan students, including government scholarships (Mahapola, Bursary), university-specific scholarships, private organization scholarships, corporate scholarships, and international scholarships. Additionally, some banks offer student loans for higher education. Check eligibility criteria (academic merit, financial need, specific fields) and application deadlines carefully. EduLift can guide you in finding and applying for scholarships that match your profile."
  },
  {
    keywords: ['abroad', 'foreign', 'overseas', 'international', 'study abroad', 'foreign universities', 'foreign degrees', 'education abroad', 'international student', 'foreign country', 'overseas education', 'foreign scholarship', 'student visa', 'australia', 'uk', 'usa', 'canada', 'japan', 'singapore', 'malaysia'],
    response: "Studying abroad offers valuable exposure and opportunities. Popular destinations for Sri Lankan students include USA, UK, Australia, Canada, Japan, Singapore, and Malaysia. Requirements typically include good academic records (O/L, A/L results), English proficiency (IELTS/TOEFL), and sometimes standardized tests (SAT, GRE). Consider costs (tuition, living expenses), scholarship opportunities, post-study work rights, and cultural adaptation. Many countries offer scholarships specifically for international students to help with costs."
  },
  {
    keywords: ['registration', 'register', 'sign up', 'join', 'account', 'create account', 'become member', 'membership', 'enroll', 'how to register', 'registration process', 'sign in', 'login'],
    response: "Registration with EduLift is simple! Click on the 'Register' button at the top of the page, fill in your details (name, email, contact number, educational background), verify your email through the verification link we send, create a password, and you're all set. Once registered, you can access personalized guidance, resources, assessment tools, and interact with our counselors. The basic registration is free, with premium services available at additional costs."
  },
  {
    keywords: ['assessment', 'test', 'evaluation', 'aptitude', 'skills test', 'personality', 'career assessment', 'interest inventory', 'aptitude test', 'personality test', 'skill assessment', 'strength finder', 'career test', 'interest assessment', 'evaluations'],
    response: "EduLift offers various assessments including aptitude tests (measuring your natural abilities), interest inventories (identifying what you enjoy), personality assessments (understanding your work style), and skills evaluations (assessing current competencies). These help identify your strengths, preferences, and suitable educational/career paths. Results are analyzed by our counselors to provide personalized guidance. The basic assessments are free for registered users, with more comprehensive evaluations available in our premium packages."
  },
  {
    keywords: ['guidance', 'counseling', 'advice', 'mentoring', 'consultation', 'counselor', 'guidance counselor', 'educational advisor', 'career counselor', 'mentor', 'educational guidance', 'career guidance', 'personal guidance', 'counselling session', 'guidance services'],
    response: "Our guidance services include one-on-one counseling sessions (in-person or virtual), group workshops, career exploration activities, educational planning assistance, and resource provision. Our qualified counselors help with educational planning, subject selection, career path identification, university/college selection, and addressing educational challenges. Basic guidance is available to all registered users, with more intensive personalized counseling in our premium packages."
  },
  {
    keywords: ['parent', 'guardian', 'family', 'resources for parents', 'parent guide', 'family support', 'parent involvement', 'family counseling', 'resources for families', 'parent session', 'guidance for parents', 'parent workshop'],
    response: "We offer resources for parents to support their children's educational journey. These include parent guides (explaining educational pathways), family counseling sessions, parent-student workshops, and informational materials on educational options and career planning. We believe parents play a crucial role in educational decision-making and aim to equip them with the knowledge to guide their children effectively. Our parent resources help bridge the information gap and foster supportive family involvement in educational choices."
  },
  {
    keywords: ['skill', 'soft skills', 'communication', 'leadership', 'critical thinking', 'problem solving', 'teamwork', 'digital literacy', 'interpersonal skills', 'adaptability', 'time management', 'emotional intelligence', 'personal development', 'professional skills', 'life skills'],
    response: "Developing soft skills alongside academic knowledge is crucial for career success. Key skills sought by employers include communication, problem-solving, critical thinking, teamwork, leadership, digital literacy, adaptability, time management, and emotional intelligence. EduLift offers workshops, resources, and training programs to help develop these skills. We recommend participating in extracurricular activities, volunteering, internships, and projects to build these skills practically. Our skills development programs complement academic learning to create well-rounded graduates."
  },
  {
    keywords: ['internship', 'work experience', 'practical', 'training', 'volunteer', 'part-time', 'industrial training', 'practical experience', 'job training', 'hands-on experience', 'industry exposure', 'work placement', 'apprenticeship', 'practical skills', 'industry training', 'professional experience'],
    response: "Practical experience through internships, volunteering, or part-time work is valuable for skill development and career exploration. It helps you apply theoretical knowledge, understand workplace dynamics, build professional networks, enhance your resume, and sometimes leads to job offers. EduLift can guide you in finding suitable opportunities through our industry partnerships. We recommend starting to gain experience even during your studies. Many universities and colleges have industrial placement programs, and we can help you leverage these opportunities."
  },
  {
    keywords: ['online', 'distance', 'remote', 'virtual', 'e-learning', 'online courses', 'distance learning', 'remote learning', 'online degree', 'virtual classroom', 'online education', 'e-learning platform', 'mooc', 'online university', 'distance education', 'web-based learning'],
    response: "Online and distance education options have expanded significantly in Sri Lanka. Several universities and institutes offer online degrees, diplomas, and certificates. These programs offer flexibility, allowing you to study while working or managing other responsibilities. Reputable providers include Open University of Sri Lanka, National Online Distance Education Service, and international platforms like Coursera and edX offering courses from global universities. When choosing online programs, verify accreditation, check recognition by employers, and ensure you have the self-discipline for independent learning."
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'useful', 'gratitude', 'thank you', 'helped', 'great help', 'good job', 'well done'],
    response: "You're welcome! I'm glad I could help. If you have any other questions or need further guidance, feel free to ask anytime. EduLift is committed to supporting your educational journey every step of the way."
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'talk later', 'until next time', 'later', 'farewell', 'end conversation', 'finish', 'see ya', 'have a good day', 'take care'],
    response: "Goodbye! Feel free to return whenever you need educational guidance. Best wishes for your educational journey! Remember, we're here to support you whenever you need assistance."
  },
  {
    keywords: ['fees', 'cost', 'tuition', 'charges', 'pricing', 'payment', 'expensive', 'affordable', 'fee structure', 'course fees', 'program cost', 'tuition fees', 'service charges', 'price', 'financial', 'budget'],
    response: "Educational costs in Sri Lanka vary widely. Public universities are nearly free (minimal registration fees) for those who qualify. Private universities range from Rs. 500,000 to Rs. 4 million for a full degree. Vocational training costs Rs. 25,000 to Rs. 300,000 depending on the program. Professional courses vary based on the qualification. EduLift's basic guidance services are free, with premium personalized counseling packages starting at Rs. 3,000. Financial aid, scholarships, and payment plans are available for most educational paths."
  },
  {
    keywords: ['best', 'top', 'highest', 'renowned', 'prestigious', 'quality', 'ranking', 'rated', 'best university', 'top course', 'best program', 'highest ranked', 'best institute', 'prestigious university', 'top rated', 'best career', 'best option'],
    response: "The 'best' educational option depends on your personal goals, interests, and circumstances. In Sri Lanka, University of Peradeniya, University of Colombo, and University of Moratuwa are highly regarded in different fields. However, program quality, available facilities, industry connections, and alignment with your career goals matter more than general rankings. EduLift can help you evaluate options based on your specific needs rather than just reputation. We recommend considering factors like graduate employability, industry partnerships, practical training, and support services when choosing institutions."
  },
  {
    keywords: ['courses', 'programs', 'subjects', 'degrees', 'study programs', 'fields of study', 'majors', 'specializations', 'course options', 'educational programs', 'study options', 'available courses', 'program list', 'subjects offered', 'degree programs', 'course catalog', 'curriculum'],
    response: "Sri Lanka offers diverse educational programs across various levels. Universities offer degrees in medicine, engineering, IT, business, law, arts, sciences, and more. Professional bodies provide qualifications in accounting (CIMA, CMA, CA), marketing (CIM), banking, and insurance. Vocational training covers technical areas like automotive, electronics, construction, hospitality, beauty culture, and more. The right program depends on your interests, strengths, and career goals. EduLift can provide detailed information on specific courses, entry requirements, and career outcomes for any field that interests you."
  }
];

// Default fallback responses when no match is found
const fallbackResponses = [
  "I'm not sure I understood that completely. Could you rephrase your question about educational guidance?",
  "That's an interesting question. To provide the best guidance, could you be more specific about what educational information you're looking for?",
  "I don't have enough information about that yet, but I'm learning. Could you ask something related to educational pathways, career guidance, or our services?",
  "I want to help you with your educational journey. Could you provide more details about what specific guidance you need?",
  "I'm specialized in educational guidance for Sri Lankan students. If your question is related to that, could you rephrase it?"
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageId, setMessageId] = useState(1);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [lastTopic, setLastTopic] = useState<string>('');
  const [educationStage, setEducationStage] = useState<EducationStage>('not_specified');
  const [showStageSelector, setShowStageSelector] = useState(true);

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 0,
          text: "Hi there! I'm EduLift's AI assistant. How can I help you with your educational guidance needs today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [open, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
  
  // Basic function to find the best response from knowledge base
  const findResponse = (userMessage: string): string => {
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
        score: score
      };
    });
    
    // Sort by score in descending order
    matches.sort((a, b) => b.score - a.score);
    
    // If we have a match with a positive score, return that response
    if (matches[0].score > 0) {
      return matches[0].response;
    }
    
    // If no match, return a random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
      return findResponse(userMessage);
    }
  };

  // Enhanced response finder with context awareness
  const findResponseWithContext = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Check for follow-up questions related to the last topic
    const isFollowUpQuestion = /^(what|how|when|where|why|which|can you|tell me|more about|explain|elaborate)/i.test(userMessageLower);
    
    // If it seems like a follow-up question and we have a last topic
    if (isFollowUpQuestion && lastTopic && userMessage.length < 60) {
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
          score: score
        };
      });
      
      matches.sort((a, b) => b.score - a.score);
      
      if (matches[0].score > 0) {
        return matches[0].response;
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

  // Enhanced response finder with education stage awareness
  const findCustomizedResponse = (userMessage: string): string => {
    const response = findResponseWithContext(userMessage);
    
    // If education stage is not specified, return the standard response
    if (educationStage === 'not_specified') {
      return response;
    }
    
    // Customize response based on education stage when appropriate
    const lowerMessage = userMessage.toLowerCase();
    
    // Add stage-specific advice for certain topics
    if (educationStage === 'just_completed_ol' && 
        (lowerMessage.includes('what should i do') || lowerMessage.includes('next step') || lowerMessage.includes('career'))) {
      return `${response}\n\nSince you've just completed O/L, focus on exploring different A/L streams and subjects that match your interests and strengths. Consider visiting schools or speaking with teachers about their A/L programs. It's also a good time to start thinking about broad career fields that interest you.`;
    }
    
    if (educationStage === 'studying_al' && 
        (lowerMessage.includes('university') || lowerMessage.includes('college') || lowerMessage.includes('higher education'))) {
      return `${response}\n\nAs you're currently studying A/L, focus on maintaining good grades while researching university programs that interest you. Start preparing for university entrance requirements and explore scholarship opportunities. Consider visiting university open days when available.`;
    }
    
    if (educationStage === 'completed_al' && 
        (lowerMessage.includes('what now') || lowerMessage.includes('what should i do') || lowerMessage.includes('next step'))) {
      return `${response}\n\nHaving completed A/L, you should be focusing on university applications or exploring alternative paths like professional qualifications, vocational training, or entry-level positions that align with your career interests. This is a good time to build practical skills through short courses while waiting for university admission.`;
    }
    
    // Return the standard response if no customization is needed
    return response;
  };

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
    
    let responseText: string;
    
    // Try to get response from AI if enabled, otherwise use knowledge base with context
    if (aiConfig.enabled && aiConfig.apiKey) {
      try {
        responseText = await getAIResponse(newMessage);
      } catch (error) {
        console.error('Error in AI response:', error);
        responseText = findCustomizedResponse(newMessage);
      }
    } else {
      // Use knowledge base with context awareness and education stage customization
      responseText = findCustomizedResponse(newMessage);
    }
    
    // Update conversation context
    updateConversationContext(newMessage, responseText);
    
    // Calculate a more realistic typing delay based on response length
    const baseDelay = 1000; // minimum 1 second
    const charactersPerSecond = 20;
    const additionalDelay = Math.min(
      responseText.length / charactersPerSecond * 1000,
      2500 // cap at 2.5 seconds max additional delay
    );
    
    setTimeout(() => {
      const botMessage: Message = {
        id: messageId + 1,
        text: responseText,
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
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            height: '100%',
            bgcolor: mode === 'light' ? 'background.paper' : 'background.default'
          }
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
              <SmartToyIcon />
            </Avatar>
            <Typography variant="h6">EduLift Assistant</Typography>
          </Box>
          <Box>
            <IconButton 
              onClick={() => setShowStageSelector(!showStageSelector)}
              sx={{ color: 'white', mr: 1 }}
            >
              <Box
                component="div"
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                ⚙️
              </Box>
            </IconButton>
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        </Box>

        {/* Education Stage Selector */}
        {showStageSelector && (
          <Box sx={{ px: 2, pt: 2 }}>
            <EducationStageSelector 
              currentStage={educationStage} 
              onChange={handleStageChange} 
            />
          </Box>
        )}

        <Divider />

        {/* Messages Container */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: mode === 'light' ? '#f5f7fa' : '#1a202c'
          }}
        >
          <List sx={{ width: '100%' }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                        width: 36,
                        height: 36
                      }}
                    >
                      {message.sender === 'user' ? 'U' : <SmartToyIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      maxWidth: '80%',
                      bgcolor: message.sender === 'user'
                        ? (mode === 'light' ? 'secondary.light' : 'secondary.dark')
                        : (mode === 'light' ? 'primary.light' : 'primary.dark'),
                      color: message.sender === 'user'
                        ? (mode === 'light' ? 'secondary.contrastText' : 'white')
                        : (mode === 'light' ? 'primary.contrastText' : 'white'),
                      whiteSpace: 'pre-line' // Allows for line breaks in responses
                    }}
                  >
                    <ListItemText
                      primary={message.text}
                      secondary={message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      secondaryTypographyProps={{
                        sx: {
                          color: 'inherit',
                          opacity: 0.7,
                          fontSize: '0.75rem',
                          mt: 1
                        }
                      }}
                    />
                  </Paper>
                </Box>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 36,
                        height: 36
                      }}
                    >
                      <SmartToyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
                      color: mode === 'light' ? 'primary.contrastText' : 'white'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} color="inherit" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Typing...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: mode === 'light' ? 'background.paper' : 'background.default'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
            disabled={isTyping}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default ChatbotComponent; 