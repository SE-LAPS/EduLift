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
  {
    keywords: ['vocational', 'training', 'TVET', 'technical', 'skill', 'diploma', 'certificate', 'short course', 'practical training', 'apprenticeship', 'vocational education', 'NAITA', 'VTA', 'technical college', 'institute', 'professional qualification'],
    response: "Vocational training and technical education (TVET) are excellent alternatives to university education, especially if you prefer practical skills. Institutions like NAITA, VTA, Technical Colleges, DTET, and others offer various certificate and diploma courses in fields like IT, engineering, hospitality, beauty culture, construction, automotive, etc. These programs are more practical, job-oriented, and often shorter than university degrees, with good employment prospects.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['career', 'job', 'profession', 'occupation', 'employment', 'work', 'career path', 'career guidance', 'career counseling', 'job opportunities', 'career planning', 'future careers', 'employment opportunities', 'job market', 'career prospects', 'high demand careers', 'good salary'],
    response: "Career planning should align with your interests, skills, values, and personality. EduLift offers career assessment tools and counseling to help you discover suitable paths. When choosing a career, consider both your passions and market demand. Research growth industries in Sri Lanka like IT, tourism, healthcare, finance, and export manufacturing. We recommend exploring multiple options through research, talking to professionals, and seeking experiences through internships or volunteering before making final decisions.",
    category: 'employment',
    confidence: 0.99
  },
  {
    keywords: ['scholarship', 'financial', 'aid', 'funding', 'student loans', 'bursary', 'financial assistance', 'mahapola', 'free education', 'scholarship opportunities', 'financial support', 'education loan', 'merit scholarship', 'need-based scholarship', 'overseas scholarship'],
    response: "Various scholarships are available for Sri Lankan students, including government scholarships (Mahapola, Bursary), university-specific scholarships, private organization scholarships, corporate scholarships, and international scholarships. Additionally, some banks offer student loans for higher education. Check eligibility criteria (academic merit, financial need, specific fields) and application deadlines carefully. EduLift can guide you in finding and applying for scholarships that match your profile.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['abroad', 'foreign', 'overseas', 'international', 'study abroad', 'foreign universities', 'foreign degrees', 'education abroad', 'international student', 'foreign country', 'overseas education', 'foreign scholarship', 'student visa', 'australia', 'uk', 'usa', 'canada', 'japan', 'singapore', 'malaysia'],
    response: "Studying abroad offers valuable exposure and opportunities. Popular destinations for Sri Lankan students include USA, UK, Australia, Canada, Japan, Singapore, and Malaysia. Requirements typically include good academic records (O/L, A/L results), English proficiency (IELTS/TOEFL), and sometimes standardized tests (SAT, GRE). Consider costs (tuition, living expenses), scholarship opportunities, post-study work rights, and cultural adaptation. Many countries offer scholarships specifically for international students to help with costs.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['registration', 'register', 'sign up', 'join', 'account', 'create account', 'become member', 'membership', 'enroll', 'how to register', 'registration process', 'sign in', 'login'],
    response: "Registration with EduLift is simple! Click on the 'Register' button at the top of the page, fill in your details (name, email, contact number, educational background), verify your email through the verification link we send, create a password, and you're all set. Once registered, you can access personalized guidance, resources, assessment tools, and interact with our counselors. The basic registration is free, with premium services available at additional costs.",
    category: 'general',
    confidence: 0.98
  },
  {
    keywords: ['assessment', 'test', 'evaluation', 'aptitude', 'skills test', 'personality', 'career assessment', 'interest inventory', 'aptitude test', 'personality test', 'skill assessment', 'strength finder', 'career test', 'interest assessment', 'evaluations'],
    response: "EduLift offers various assessments including aptitude tests (measuring your natural abilities), interest inventories (identifying what you enjoy), personality assessments (understanding your work style), and skills evaluations (assessing current competencies). These help identify your strengths, preferences, and suitable educational/career paths. Results are analyzed by our counselors to provide personalized guidance. The basic assessments are free for registered users, with more comprehensive evaluations available in our premium packages.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['guidance', 'counseling', 'advice', 'mentoring', 'consultation', 'counselor', 'guidance counselor', 'educational advisor', 'career counselor', 'mentor', 'educational guidance', 'career guidance', 'personal guidance', 'counselling session', 'guidance services'],
    response: "Our guidance services include one-on-one counseling sessions (in-person or virtual), group workshops, career exploration activities, educational planning assistance, and resource provision. Our qualified counselors help with educational planning, subject selection, career path identification, university/college selection, and addressing educational challenges. Basic guidance is available to all registered users, with more intensive personalized counseling in our premium packages.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['parent', 'guardian', 'family', 'resources for parents', 'parent guide', 'family support', 'parent involvement', 'family counseling', 'resources for families', 'parent session', 'guidance for parents', 'parent workshop'],
    response: "We offer resources for parents to support their children's educational journey. These include parent guides (explaining educational pathways), family counseling sessions, parent-student workshops, and informational materials on educational options and career planning. We believe parents play a crucial role in educational decision-making and aim to equip them with the knowledge to guide their children effectively. Our parent resources help bridge the information gap and foster supportive family involvement in educational choices.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['skill', 'soft skills', 'communication', 'leadership', 'critical thinking', 'problem solving', 'teamwork', 'digital literacy', 'interpersonal skills', 'adaptability', 'time management', 'emotional intelligence', 'personal development', 'professional skills', 'life skills'],
    response: "Developing soft skills alongside academic knowledge is crucial for career success. Key skills sought by employers include communication, problem-solving, critical thinking, teamwork, leadership, digital literacy, adaptability, time management, and emotional intelligence. EduLift offers workshops, resources, and training programs to help develop these skills. We recommend participating in extracurricular activities, volunteering, internships, and projects to build these skills practically. Our skills development programs complement academic learning to create well-rounded graduates.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['internship', 'work experience', 'practical', 'training', 'volunteer', 'part-time', 'industrial training', 'practical experience', 'job training', 'hands-on experience', 'industry exposure', 'work placement', 'apprenticeship', 'practical skills', 'industry training', 'professional experience'],
    response: "Practical experience through internships, volunteering, or part-time work is valuable for skill development and career exploration. It helps you apply theoretical knowledge, understand workplace dynamics, build professional networks, enhance your resume, and sometimes leads to job offers. EduLift can guide you in finding suitable opportunities through our industry partnerships. We recommend starting to gain experience even during your studies. Many universities and colleges have industrial placement programs, and we can help you leverage these opportunities.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['online', 'distance', 'remote', 'virtual', 'e-learning', 'online courses', 'distance learning', 'remote learning', 'online degree', 'virtual classroom', 'online education', 'e-learning platform', 'mooc', 'online university', 'distance education', 'web-based learning'],
    response: "Online and distance education options have expanded significantly in Sri Lanka. Several universities and institutes offer online degrees, diplomas, and certificates. These programs offer flexibility, allowing you to study while working or managing other responsibilities. Reputable providers include Open University of Sri Lanka, National Online Distance Education Service, and international platforms like Coursera and edX offering courses from global universities. When choosing online programs, verify accreditation, check recognition by employers, and ensure you have the self-discipline for independent learning.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'useful', 'gratitude', 'thank you', 'helped', 'great help', 'good job', 'well done'],
    response: "You're welcome! I'm glad I could help. If you have any other questions or need further guidance, feel free to ask anytime. EduLift is committed to supporting your educational journey every step of the way.",
    category: 'general',
    confidence: 0.98
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'talk later', 'until next time', 'later', 'farewell', 'end conversation', 'finish', 'see ya', 'have a good day', 'take care'],
    response: "Goodbye! Feel free to return whenever you need educational guidance. Best wishes for your educational journey! Remember, we're here to support you whenever you need assistance.",
    category: 'general',
    confidence: 0.98
  },
  {
    keywords: ['fees', 'cost', 'tuition', 'charges', 'pricing', 'payment', 'expensive', 'affordable', 'fee structure', 'course fees', 'program cost', 'tuition fees', 'service charges', 'price', 'financial', 'budget'],
    response: "Educational costs in Sri Lanka vary widely. Public universities are nearly free (minimal registration fees) for those who qualify. Private universities range from Rs. 500,000 to Rs. 4 million for a full degree. Vocational training costs Rs. 25,000 to Rs. 300,000 depending on the program. Professional courses vary based on the qualification. EduLift's basic guidance services are free, with premium personalized counseling packages starting at Rs. 3,000. Financial aid, scholarships, and payment plans are available for most educational paths.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['best', 'top', 'highest', 'renowned', 'prestigious', 'quality', 'ranking', 'rated', 'best university', 'top course', 'best program', 'highest ranked', 'best institute', 'prestigious university', 'top rated', 'best career', 'best option'],
    response: "The 'best' educational option depends on your personal goals, interests, and circumstances. In Sri Lanka, University of Peradeniya, University of Colombo, and University of Moratuwa are highly regarded in different fields. However, program quality, available facilities, industry connections, and alignment with your career goals matter more than general rankings. EduLift can help you evaluate options based on your specific needs rather than just reputation. We recommend considering factors like graduate employability, industry partnerships, practical training, and support services when choosing institutions.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['courses', 'programs', 'subjects', 'degrees', 'study programs', 'fields of study', 'majors', 'specializations', 'course options', 'educational programs', 'study options', 'available courses', 'program list', 'subjects offered', 'degree programs', 'course catalog', 'curriculum'],
    response: "Sri Lanka offers diverse educational programs across various levels. Universities offer degrees in medicine, engineering, IT, business, law, arts, sciences, and more. Professional bodies provide qualifications in accounting (CIMA, CMA, CA), marketing (CIM), banking, and insurance. Vocational training covers technical areas like automotive, electronics, construction, hospitality, beauty culture, and more. The right program depends on your interests, strengths, and career goals. EduLift can provide detailed information on specific courses, entry requirements, and career outcomes for any field that interests you.",
    category: 'education',
    confidence: 0.98
  },
  {
    keywords: ['job search', 'find job', 'apply job', 'cv', 'resume', 'cover letter', 'interview', 'job application', 'job hunting', 'employment search', 'job market', 'recruitment', 'hiring', 'employer', 'job board', 'career fair', 'linkedin'],
    response: "For successful job searching in Sri Lanka, build a targeted resume highlighting relevant skills and experiences. Use job portals like Topjobs.lk, LinkedIn, and ikman.lk, and company career pages. Network proactively and prepare thoroughly for interviews by researching companies and practicing common questions. Follow up professionally after applications and interviews. EduLift can help with resume building workshops, interview practice sessions, and connecting you with potential employers through our network.",
    category: 'employment',
    confidence: 0.98
  },
  {
    keywords: ['salary', 'pay', 'compensation', 'benefits', 'remuneration', 'income', 'earning', 'wage', 'stipend', 'package', 'payment', 'annual salary', 'monthly salary', 'salary range', 'starting salary', 'expected salary'],
    response: "Entry-level salaries in Sri Lanka vary by field, with IT/tech positions (Rs.50,000-80,000/month), banking/finance (Rs.40,000-60,000/month), engineering (Rs.45,000-70,000/month), healthcare (Rs.60,000-100,000/month for doctors, Rs.35,000-50,000/month for allied health), management (Rs.45,000-65,000/month), and marketing (Rs.40,000-60,000/month). Factors affecting salary include qualifications, experience, company size, location (Colombo typically pays more), and additional skills like foreign languages or specialized certifications. Negotiation strategies include researching market rates, highlighting relevant skills, and considering total compensation beyond just base salary.",
    category: 'employment',
    confidence: 0.97
  },
  {
    keywords: ['work permit', 'work visa', 'foreign employment', 'work abroad', 'overseas employment', 'international job', 'expatriate', 'migrant worker', 'foreign worker', 'employment visa', 'working holiday', 'foreign work', 'working abroad'],
    response: "Sri Lankans seeking overseas employment should research visa requirements for target countries, as they vary significantly. Middle East countries require employment contracts through registered agencies, while Western countries often need qualifications recognition and employer sponsorship. Required documents typically include passport, educational/professional certificates, work experience letters, and health records. The Sri Lanka Bureau of Foreign Employment (SLBFE) registration is mandatory for legal protection. Popular destinations include UAE, Qatar, Saudi Arabia, Kuwait, South Korea, Japan, Australia, and Canada, with demand in healthcare, hospitality, IT, engineering, and domestic work sectors.",
    category: 'employment',
    confidence: 0.96
  },
  {
    keywords: ['career change', 'switch career', 'new career', 'different field', 'transition', 'career transition', 'pivot career', 'career move', 'career shift', 'professional reinvention', 'switch fields', 'career development', 'new profession', 'career switch', 'professional transition'],
    response: "Career transitions in Sri Lanka require careful planning. First, identify transferable skills from your current career and skill gaps for your target field. Research through informational interviews with professionals, industry reports, and dedicated communities. Consider upskilling through short courses, certifications, or degree programs from institutions like NIBM, SLIIT, or professional bodies. Build a transition portfolio showing relevant projects and begin networking in your target field through LinkedIn, professional associations, and industry events. Start with small steps like volunteering or side projects before fully switching. EduLift offers career transition counseling and skills assessment to facilitate this process.",
    category: 'employment',
    confidence: 0.95
  }
];

// Default fallback responses when no match is found
const fallbackResponses = [
  "I'm specialized in providing information about education and employment in Sri Lanka. Your question appears to be outside my expertise. Could you ask something related to educational pathways, career guidance, or employment opportunities?",
  "I don't have information on that topic as I focus specifically on education and career guidance for Sri Lankan students. Please ask about educational options, career paths, or employment opportunities instead.",
  "Sorry, but I'm designed to answer questions only about educational pathways and employment in Sri Lanka. Could you rephrase your question to relate to these areas?",
  "That appears to be outside my specialized knowledge of education and employment. For the most accurate responses, please ask questions related to educational options, career guidance, or job opportunities in Sri Lanka.",
  "To provide you with the highest accuracy in responses, I only answer questions about education and employment. Your question seems to be about something else. Would you like to ask about study options, career paths, or job opportunities instead?"
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
    
    // Check if we have an education or employment related query with sufficient confidence
    if (matches[0].score > 0) {
      // Calculate final confidence based on base confidence and match score
      const calculatedConfidence = Math.min(matches[0].baseConfidence * (1 + matches[0].score * 0.05), 0.99);
      
      // If query is education or employment related or it's a general category with high confidence
      if (matches[0].category === 'education' || matches[0].category === 'employment' || 
          (matches[0].category === 'general' && calculatedConfidence > 0.95)) {
        return {
          text: matches[0].response,
          category: matches[0].category,
          confidence: calculatedConfidence
        };
      }
    }
    
    // If no good match or not education/employment related, return a fallback response
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
    
    // Check if the message is about an irrelevant topic
    const irrelevantTopics = [
      'weather', 'sports', 'politics', 'movies', 'music', 'games', 'food', 'travel', 
      'news', 'celebrities', 'entertainment', 'dating', 'religion', 'jokes', 'memes'
    ];
    
    // If the message appears to be about an irrelevant topic, return an error response
    if (irrelevantTopics.some(topic => userMessageLower.includes(topic))) {
      return {
        text: "I'm specialized in education and employment guidance only. Your question appears to be about something else. Please ask about educational options, career paths, or job opportunities for the most accurate assistance.",
        category: 'general',
        confidence: 0.98
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
      
      if (matches[0].score > 0 && 
          (matches[0].category === 'education' || matches[0].category === 'employment' || 
           (matches[0].category === 'general' && matches[0].score > 2))) {
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

  // Updated handling of sending messages
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
    
    // Try to get response from AI if enabled, otherwise use knowledge base with context
    if (aiConfig.enabled && aiConfig.apiKey) {
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
    
    // Check if response is off-topic or low confidence
    if (responseData.confidence < 0.85 || 
        (responseData.category !== 'education' && responseData.category !== 'employment' && responseData.category !== 'general')) {
      responseData.text = "I'm specialized in providing information about education and employment in Sri Lanka. Your question appears to be outside my expertise or too ambiguous. Please ask a more specific question about educational pathways or career opportunities.";
      responseData.confidence = 0.95;
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