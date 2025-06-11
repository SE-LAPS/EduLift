import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import ChatbotComponent from '../components/Chatbot';

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>EduLift - Educational Guidance Platform</title>
          <meta name="description" content="EduLift - Guiding Sri Lankan students after their O/L examinations" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ChatbotComponent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
