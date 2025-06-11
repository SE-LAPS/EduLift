import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { Box, Fab, Tooltip, Zoom } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeContext } from '../contexts/ThemeContext';

// Chatbot configuration
const config = {
  initialMessages: [
    {
      id: 'welcome',
      message: 'Hello! Welcome to EduLift. How can I help you today?',
      delay: 500,
    },
  ],
  botName: 'EduLift Assistant',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#0057FF',
    },
    chatButton: {
      backgroundColor: '#0057FF',
    },
  },
};

// Message parser - processes user messages
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || 
        lowerCaseMessage.includes('hi') || 
        lowerCaseMessage.includes('hey')) {
      this.actionProvider.handleGreeting();
    } 
    else if (lowerCaseMessage.includes('course') || 
             lowerCaseMessage.includes('program') || 
             lowerCaseMessage.includes('class')) {
      this.actionProvider.handleCourseQuery();
    }
    else if (lowerCaseMessage.includes('service') || 
             lowerCaseMessage.includes('offer') || 
             lowerCaseMessage.includes('provide')) {
      this.actionProvider.handleServiceQuery();
    }
    else if (lowerCaseMessage.includes('contact') || 
             lowerCaseMessage.includes('reach') || 
             lowerCaseMessage.includes('call') ||
             lowerCaseMessage.includes('email')) {
      this.actionProvider.handleContactQuery();
    }
    else if (lowerCaseMessage.includes('about') || 
             lowerCaseMessage.includes('who') || 
             lowerCaseMessage.includes('what is edulift')) {
      this.actionProvider.handleAboutQuery();
    }
    else if (lowerCaseMessage.includes('thank')) {
      this.actionProvider.handleThanks();
    }
    else {
      this.actionProvider.handleDefault();
    }
  }
}

// Action provider - defines bot responses
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }
  
  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  handleGreeting = () => {
    const message = this.createChatBotMessage(
      "Hi there! It's great to meet you. How can I assist you with your educational journey today?"
    );
    this.addMessageToState(message);
  };

  handleCourseQuery = () => {
    const message = this.createChatBotMessage(
      "We offer various courses including Academic Guidance, Career Development, and Skills Assessment. Would you like to know more about any specific course?"
    );
    this.addMessageToState(message);
  };

  handleServiceQuery = () => {
    const message = this.createChatBotMessage(
      "EduLift provides comprehensive educational services including academic guidance, career counseling, skills assessment, language programs, digital literacy training, and mentorship opportunities. Which service would you like to learn more about?"
    );
    this.addMessageToState(message);
  };

  handleContactQuery = () => {
    const message = this.createChatBotMessage(
      "You can reach us at info@edulift.com or call us at +94 11 234 5678. Our office is located at 123 Education Street, Colombo 05, Sri Lanka. Our team is available Monday to Friday, 9am to 5pm."
    );
    this.addMessageToState(message);
  };

  handleAboutQuery = () => {
    const message = this.createChatBotMessage(
      "EduLift is an educational platform dedicated to guiding Sri Lankan students after their O/L examinations. We provide resources, guidance, and opportunities to help students make informed decisions about their future academic and career paths."
    );
    this.addMessageToState(message);
  };

  handleThanks = () => {
    const message = this.createChatBotMessage(
      "You're welcome! I'm happy to help. If you have any other questions, feel free to ask anytime."
    );
    this.addMessageToState(message);
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm not sure I understand. Could you rephrase your question? You can ask about our courses, services, contact information, or about EduLift in general."
    );
    this.addMessageToState(message);
  };
}

const ChatbotComponent = () => {
  const [showChat, setShowChat] = useState(false);
  const { mode } = useThemeContext();
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {showChat ? (
        <Zoom in={showChat}>
          <Box 
            sx={{ 
              position: 'absolute',
              bottom: 70,
              right: 0,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              headerText="EduLift Assistant"
              placeholderText="Type your message here..."
            />
          </Box>
        </Zoom>
      ) : null}
      
      <Tooltip title={showChat ? "Close chat" : "Chat with us"} placement="left">
        <Fab 
          color="primary" 
          aria-label="chat"
          onClick={toggleChat}
          sx={{ 
            boxShadow: '0 4px 20px rgba(0, 87, 255, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          {showChat ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default ChatbotComponent; 