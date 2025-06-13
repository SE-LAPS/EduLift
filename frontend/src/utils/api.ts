import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.sub_status === 42 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/api/auth/refresh', {}, {
          headers: { 'Authorization': `Bearer ${refreshToken}` }
        });

        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);

        // Update the authorization header and retry the request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }) => api.post('/auth/register', userData),
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  changePassword: (currentPassword: string, newPassword: string) => 
    api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  
  updateProfile: (userData: any) => 
    api.put('/users/me', userData),
  
  getUsers: (params?: any) => 
    api.get('/users', { params }),
  
  getUserById: (id: number) => 
    api.get(`/users/${id}`),
  
  createUser: (userData: any) => 
    api.post('/users', userData),
  
  updateUser: (id: number, userData: any) => 
    api.put(`/users/${id}`, userData),
  
  deleteUser: (id: number) => 
    api.delete(`/users/${id}`),
};

// Tests API
export const testsAPI = {
  getTests: (params?: any) => 
    api.get('/tests', { params }),
  
  getTestById: (id: number) => 
    api.get(`/tests/${id}`),
  
  createTest: (testData: any) => 
    api.post('/tests', testData),
  
  updateTest: (id: number, testData: any) => 
    api.put(`/tests/${id}`, testData),
  
  deleteTest: (id: number) => 
    api.delete(`/tests/${id}`),
  
  getStudentTests: () => 
    api.get('/tests/student'),
  
  submitTestAnswers: (testId: number, answers: any) => 
    api.post(`/tests/${testId}/submit`, { answers }),
};

// Exams API
export const examsAPI = {
  getExams: (params?: any) => 
    api.get('/exams', { params }),
  
  getExamById: (id: number) => 
    api.get(`/exams/${id}`),
  
  createExam: (examData: any) => 
    api.post('/exams', examData),
  
  updateExam: (id: number, examData: any) => 
    api.put(`/exams/${id}`, examData),
  
  deleteExam: (id: number) => 
    api.delete(`/exams/${id}`),
  
  getStudentExams: () => 
    api.get('/exams/student'),
  
  submitExamAnswers: (examId: number, answers: any) => 
    api.post(`/exams/${examId}/submit`, { answers }),

  evaluateExam: (examId: number, studentId: number, evaluation: any) => 
    api.post(`/exams/${examId}/evaluate/${studentId}`, evaluation),
};

// ML API
export const mlAPI = {
  analyzeHandwriting: (formData: FormData) => 
    api.post('/ml/handwriting/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getUserHandwritingSamples: () => 
    api.get('/ml/handwriting/samples'),
};

export default api; 