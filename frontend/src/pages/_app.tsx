import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import ChatbotComponent from '../components/Chatbot';
import WaveCursor from '../components/WaveCursor';
import { Box } from '@mui/material';

function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>EduLift - Educational Guidance Platform</title>
          <meta name="description" content="EduLift - Guiding Sri Lankan students after their O/L examinations" />
          <link rel="icon" href="/images/edu.png" />
        </Head>
        
        {loading ? (
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '100vw',
              backgroundColor: (theme) => theme.palette.background.default
            }}
          >
            <Box 
              component="img"
              src="/images/edu.gif"
              alt="Loading..."
              sx={{
                width: { xs: '250px', sm: '300px', md: '350px' },
                height: 'auto',
                animation: 'pulse 2s infinite ease-in-out'
              }}
            />
          </Box>
        ) : (
          <>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ChatbotComponent />
            <WaveCursor />
          </>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
