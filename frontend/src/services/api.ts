import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/api/auth/login', { username, password }),
  
  refreshToken: (refreshToken: string) => 
    api.post('/api/auth/refresh', { refresh_token: refreshToken }),
  
  changePassword: (currentPassword: string, newPassword: string) => 
    api.post('/api/auth/change-password', { current_password: currentPassword, new_password: newPassword })
};

// User API
export const userAPI = {
  getUsers: () => api.get('/api/users'),
  
  getUser: (id: number) => api.get(`/api/users/${id}`),
  
  createUser: (userData: any) => api.post('/api/users', userData),
  
  updateUser: (id: number, userData: any) => api.put(`/api/users/${id}`, userData),
  
  deleteUser: (id: number) => api.delete(`/api/users/${id}`),
  
  updateUserRole: (id: number, role: string) => 
    api.put(`/api/users/${id}/role`, { role }),
  
  toggleUserStatus: (id: number, isActive: boolean) => 
    api.put(`/api/users/${id}/status`, { is_active: isActive })
};

// Test API
export const testAPI = {
  getTests: () => api.get('/api/tests'),
  
  getTest: (id: number) => api.get(`/api/tests/${id}`),
  
  createTest: (testData: any) => api.post('/api/tests', testData),
  
  updateTest: (id: number, testData: any) => api.put(`/api/tests/${id}`, testData),
  
  deleteTest: (id: number) => api.delete(`/api/tests/${id}`),
  
  getStudentTests: () => api.get('/api/tests/student'),
  
  submitTestAnswers: (testId: number, answers: any) => 
    api.post(`/api/tests/${testId}/submit`, { answers })
};

// Exam API
export const examAPI = {
  getExams: () => api.get('/api/exams'),
  
  getExam: (id: number) => api.get(`/api/exams/${id}`),
  
  createExam: (examData: any) => api.post('/api/exams', examData),
  
  updateExam: (id: number, examData: any) => api.put(`/api/exams/${id}`, examData),
  
  deleteExam: (id: number) => api.delete(`/api/exams/${id}`),
  
  getStudentExams: () => api.get('/api/exams/student'),
  
  getExamEvaluations: (examId: number) => api.get(`/api/exams/${examId}/evaluations`),
  
  submitExamEvaluation: (examId: number, studentId: number, evaluationData: any) => 
    api.post(`/api/exams/${examId}/students/${studentId}/evaluate`, evaluationData),
  
  uploadAnswerSheet: (examId: number, formData: FormData) => 
    api.post(`/api/exams/${examId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
};

// ML API
export const mlAPI = {
  uploadHandwritingSample: (studentId: number, formData: FormData) => 
    api.post(`/api/ml/handwriting/${studentId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  trainHandwritingModel: (studentId: number) => 
    api.post(`/api/ml/handwriting/${studentId}/train`),
  
  verifyHandwriting: (studentId: number, formData: FormData) => 
    api.post(`/api/ml/handwriting/${studentId}/verify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
};

export default api; 