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

// Sample responses for demo purposes
const sampleResponses = [
  "Welcome to EduLift! How can I help you with your educational journey today?",
  "After O/L examinations, you have several paths available: A/Levels, vocational training, professional certifications, or diploma courses. What interests you most?",
  "For A/Level streams, you can choose from Science, Commerce, Arts, or Technology based on your interests and career goals.",
  "Our career assessment tools can help identify your strengths and suggest suitable educational paths.",
  "EduLift offers personalized guidance sessions with experienced counselors. Would you like me to help schedule an appointment?",
  "The registration process is simple! Just click on the Register button at the top of the page and fill in your details.",
  "Yes, we offer resources for both students and parents to help navigate educational decisions together."
];

export const ChatbotComponent: React.FC = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageId, setMessageId] = useState(1);

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

  const handleSendMessage = (e: React.FormEvent) => {
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
    
    // Simulate bot response after delay
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      const botMessage: Message = {
        id: messageId + 1,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setMessageId(prev => prev + 2);
      setIsTyping(false);
    }, 1500);
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
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

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
                        : (mode === 'light' ? 'primary.contrastText' : 'white')
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