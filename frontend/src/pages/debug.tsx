import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, Alert, TextField, Grid } from '@mui/material';
import axios from 'axios';
import api from '../utils/api';

const Debug = () => {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testError, setTestError] = useState<any>(null);
  const [directTestStatus, setDirectTestStatus] = useState<string | null>(null);
  const [directTestResponse, setDirectTestResponse] = useState<any>(null);
  const [directTestError, setDirectTestError] = useState<any>(null);
  const [registerStatus, setRegisterStatus] = useState<string | null>(null);
  const [registerResponse, setRegisterResponse] = useState<any>(null);
  const [registerError, setRegisterError] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const testApiConnection = async () => {
    setTestStatus('loading');
    setTestResponse(null);
    setTestError(null);
    
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTestResponse(data);
      setTestStatus('success');
    } catch (err) {
      console.error('API test error:', err);
      setTestError(err);
      setTestStatus('error');
    }
  };
  
  const testDirectConnection = async () => {
    setDirectTestStatus('loading');
    setDirectTestResponse(null);
    setDirectTestError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/auth/test');
      setDirectTestResponse(response.data);
      setDirectTestStatus('success');
    } catch (err) {
      console.error('Direct API test error:', err);
      setDirectTestError(err);
      setDirectTestStatus('error');
    }
  };
  
  const testRegistration = async () => {
    if (!username || !email) {
      setRegisterError('Username and email are required');
      return;
    }
    
    setRegisterStatus('loading');
    setRegisterResponse(null);
    setRegisterError(null);
    
    try {
      const userData = {
        username,
        email,
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role: 'student'
      };
      
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      setRegisterResponse(response.data);
      setRegisterStatus('success');
    } catch (err: any) {
      console.error('Registration test error:', err);
      if (err.response) {
        setRegisterError(err.response.data);
      } else {
        setRegisterError({ message: err.message });
      }
      setRegisterStatus('error');
    }
  };
  
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>API Debug Page</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test API Connection (Via Next.js API Route)</Typography>
              <Button 
                variant="contained" 
                onClick={testApiConnection}
                disabled={testStatus === 'loading'}
              >
                {testStatus === 'loading' ? 'Testing...' : 'Test Connection'}
              </Button>
              
              {testStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Connection successful!
                </Alert>
              )}
              
              {testStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Connection failed. See console for details.
                </Alert>
              )}
              
              {testResponse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Response:</Typography>
                  <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </Box>
              )}
              
              {testError && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Error:</Typography>
                  <pre style={{ background: '#fff9f9', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(testError, null, 2)}
                  </pre>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Direct API Connection</Typography>
              <Button 
                variant="contained" 
                onClick={testDirectConnection}
                disabled={directTestStatus === 'loading'}
              >
                {directTestStatus === 'loading' ? 'Testing...' : 'Test Direct Connection'}
              </Button>
              
              {directTestStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Direct connection successful!
                </Alert>
              )}
              
              {directTestStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Direct connection failed. See console for details.
                </Alert>
              )}
              
              {directTestResponse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Response:</Typography>
                  <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(directTestResponse, null, 2)}
                  </pre>
                </Box>
              )}
              
              {directTestError && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Error:</Typography>
                  <pre style={{ background: '#fff9f9', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(directTestError, null, 2)}
                  </pre>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Registration</Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    type="email"
                  />
                </Grid>
              </Grid>
              
              <Button 
                variant="contained" 
                onClick={testRegistration}
                disabled={registerStatus === 'loading'}
              >
                {registerStatus === 'loading' ? 'Testing...' : 'Test Registration'}
              </Button>
              
              {registerStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Registration successful!
                </Alert>
              )}
              
              {registerStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Registration failed. See below for details.
                </Alert>
              )}
              
              {registerResponse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Response:</Typography>
                  <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(registerResponse, null, 2)}
                  </pre>
                </Box>
              )}
              
              {registerError && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Error:</Typography>
                  <pre style={{ background: '#fff9f9', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(registerError, null, 2)}
                  </pre>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Debug; 