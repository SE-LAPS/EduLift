import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
  status: string;
  message: string;
  backendResponse?: any;
  error?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // Test connection to backend
    const backendUrl = process.env.API_URL || 'http://localhost:5000/api';
    const response = await axios.get(`${backendUrl}/auth/test`);
    
    res.status(200).json({ 
      status: 'success',
      message: 'Backend connection successful',
      backendResponse: response.data
    });
  } catch (error: any) {
    console.error('Backend connection error:', error);
    
    res.status(500).json({ 
      status: 'error',
      message: 'Backend connection failed',
      error: {
        message: error.message,
        response: error.response ? {
          data: error.response.data,
          status: error.response.status
        } : 'No response'
      }
    });
  }
} 