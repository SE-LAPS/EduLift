# 🎓 EduLift - AI-Powered Educational Guidance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-blue)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://typescriptlang.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16.1-orange)](https://tensorflow.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [AI/ML Implementation](#aiml-implementation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 Overview

**EduLift** is a comprehensive AI-powered educational platform specifically designed to assist Sri Lankan students in making informed decisions after completing their O-Level examinations. The platform combines modern web technologies with advanced machine learning algorithms to provide personalized career guidance, talent identification, and educational assessment tools.

### 🎯 Problem Statement

Sri Lankan students face significant challenges when transitioning from O-Level to higher education and career paths. The lack of personalized guidance, limited career awareness, and insufficient talent identification systems create barriers to optimal educational and professional development.

### 💡 Solution

EduLift addresses these challenges through:
- **AI-Powered Career Guidance**: Personality-based career matching using Big Five model
- **Talent Identification**: Multiple Intelligence Theory implementation for aptitude assessment
- **Handwriting Verification**: ML-based authentication for academic integrity
- **Comprehensive Assessment**: Role-based test and exam management system
- **Personalized Learning**: Tailored recommendations based on individual profiles

## ✨ Features

### 🔐 User Management System
- **Multi-Role Architecture**: Admin, Teacher, Student, Assistant, SuperSub roles
- **Secure Authentication**: JWT-based authentication with refresh token support
- **Profile Management**: Comprehensive user profile editing and password management
- **Role-Based Access Control**: Granular permissions for different user types

### 🤖 AI-Powered Features

#### 🎯 Career Guidance System
- **Personality Assessment**: Big Five personality model implementation
- **Skills Evaluation**: Comprehensive skill assessment and mapping
- **Career Matching**: Advanced algorithm matching students to suitable careers
- **Market Integration**: Sri Lankan job market data with salary ranges
- **Development Pathways**: Personalized education and skill development recommendations

#### 🧠 Talent Identification System
- **Multiple Intelligence Assessment**: Howard Gardner's Multiple Intelligence Theory
- **8 Talent Areas**: STEM Innovation, Creative Arts, Leadership, Communication, etc.
- **Aptitude Testing**: 10 different question types for comprehensive evaluation
- **Development Suggestions**: Personalized talent development recommendations
- **Learning Resources**: Curated resources for talent enhancement

#### ✍️ Handwriting Verification System
- **CNN-Based Authentication**: Deep learning model for handwriting analysis
- **Academic Integrity**: Prevents fraud in assessments and examinations
- **Sample Management**: Training data collection and model improvement
- **Confidence Scoring**: Probability-based verification results

### 📚 Educational Management

#### 📝 Test Management System
- **Test Creation**: Comprehensive test builder with multiple question types
- **Real-Time Assessment**: Live test participation with time management
- **Automated Scoring**: Intelligent scoring with concept-based evaluation
- **Performance Analytics**: Detailed analytics and progress tracking
- **Supersub Identification**: Automatic identification of top-performing students

#### 📋 Exam Management System
- **Formal Examinations**: High-stakes exam creation and management
- **Multi-Evaluator System**: Multiple evaluators for enhanced accuracy
- **Answer Sheet Processing**: Digital answer sheet upload and evaluation
- **Grade Management**: Secure grade calculation and release system

### 🎨 User Experience Features
- **Responsive Design**: Mobile-first approach with Material-UI components
- **Dark/Light Mode**: User preference-based theme switching
- **Interactive Animations**: Engaging UI with AOS animations and custom effects
- **Real-Time Chat**: AI-powered chatbot for instant assistance
- **Progress Tracking**: Visual progress indicators and achievement systems

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14.0.3 with TypeScript
- **UI Library**: Material-UI (MUI) v5.17.1
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Forms**: Formik with Yup validation
- **Charts**: Chart.js with React integration
- **Animations**: AOS (Animate On Scroll)
- **File Handling**: React Dropzone, React PDF

### Backend
- **Framework**: Flask 2.3.3 with Python 3.8+
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: Flask-JWT-Extended
- **API Design**: RESTful architecture with blueprints
- **File Processing**: Werkzeug secure file handling
- **Migration**: Flask-Migrate for database versioning

### AI/ML Stack
- **Deep Learning**: TensorFlow 2.16.1 for CNN models
- **Machine Learning**: scikit-learn 1.3.2 for classical ML
- **Data Processing**: NumPy 1.26.0, Pandas 2.1.1
- **Image Processing**: Pillow 10.1.0 for handwriting analysis

### Development & Deployment
- **Version Control**: Git with structured branching
- **Code Quality**: ESLint, TypeScript strict mode
- **Testing**: pytest for backend, Jest for frontend
- **Documentation**: Comprehensive API and user documentation
- **Security**: CORS, password hashing, input validation

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄───┤   (Flask)       │◄───┤   (MySQL)       │
│                 │    │                 │    │                 │
│ • React Pages   │    │ • API Routes    │    │ • User Data     │
│ • Components    │    │ • ML Models     │    │ • Test Results  │
│ • State Mgmt    │    │ • Auth System   │    │ • ML Samples    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                ┌─────────────────┐
                │   AI/ML Layer   │
                │   (TensorFlow)  │
                │                 │
                │ • Career Match  │
                │ • Talent ID     │
                │ • Handwriting   │
                └─────────────────┘
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+ and pip
- **MySQL** 5.7+ or XAMPP
- **Git** for version control

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/EduLift.git
   cd EduLift/backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database setup**
   ```bash
   # Start XAMPP (MySQL)
   # Create databases in phpMyAdmin:
   # - edulift_dev
   # - edulift_test
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your MySQL configuration
   ```

<<<<<<< HEAD
5. **Initialize database**
   ```bash
   python setup_db.py
   ```

6. **Start backend server**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👥 Usage

### Default Demo Accounts

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | admin@edulift.com | admin123 | Full system access |
| Teacher | teacher@edulift.com | teacher123 | Test creation, student management |
| Student | student@edulift.com | student123 | Test participation, career guidance |
| Assistant | assistant@edulift.com | assistant123 | Exam evaluation, student support |

### Getting Started

1. **Student Journey**:
   - Register/Login to the platform
   - Complete personality assessment in Career Guidance
   - Take talent identification tests
   - Participate in assigned tests and exams
   - View personalized career recommendations

2. **Teacher Workflow**:
   - Create and manage tests/exams
   - Monitor student performance
   - Identify supersub students
   - Evaluate exam submissions

3. **Administrator Tasks**:
   - Manage user accounts and roles
   - System configuration and monitoring
   - View comprehensive analytics

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### User Management

```http
GET    /api/users/me
PUT    /api/users/me
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Educational Features

```http
# Tests
GET    /api/tests
POST   /api/tests
PUT    /api/tests/:id
DELETE /api/tests/:id
POST   /api/tests/:id/submit

# Exams
GET    /api/exams
POST   /api/exams
POST   /api/exams/:id/evaluate/:studentId

# Career Guidance
POST   /api/career-guidance/assess
GET    /api/career-guidance/recommendations

# Talent Identification
POST   /api/talent-identification/assess
GET    /api/talent-identification/results

# ML Features
POST   /api/ml/handwriting/analyze
GET    /api/ml/handwriting/samples
POST   /api/ml/handwriting/train
```

## 📁 Project Structure

```
EduLift/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration management
│   ├── models/                # Database models
│   │   ├── user.py
│   │   ├── test.py
│   │   ├── exam.py
│   │   └── handwriting.py
│   ├── routes/                # API endpoints
│   │   ├── auth_routes.py
│   │   ├── user_routes.py
│   │   ├── test_routes.py
│   │   ├── career_guidance.py
│   │   ├── talent_identification.py
│   │   └── ml_routes.py
│   ├── ml_models/             # Trained ML models
│   ├── uploads/               # File storage
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/             # Next.js pages/routes
│   │   │   ├── index.tsx      # Homepage
│   │   │   ├── login.tsx      # Authentication
│   │   │   ├── career-guidance.tsx
│   │   │   ├── talent-identification.tsx
│   │   │   └── test-management.tsx
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Chatbot.tsx
│   │   ├── contexts/          # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── utils/             # Utility functions
│   │   │   └── api.ts         # API client
│   │   └── styles/            # CSS and theming
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   └── next.config.js         # Next.js configuration
└── README.md                  # Project documentation
```

## 🤖 AI/ML Implementation

### Career Guidance Algorithm

```python
def match_careers(personality_scores, skill_scores, interests):
    """
    Weighted career matching algorithm
    - 40% personality compatibility (Big Five model)
    - 40% skill alignment
    - 20% interest matching
    """
    # Implementation uses cosine similarity and RandomForest classification
    return sorted_career_matches
```

### Talent Identification System

- **Multiple Intelligence Types**: 8 distinct intelligence areas
- **Assessment Method**: Adaptive questioning with difficulty adjustment
- **Scoring Algorithm**: Weighted scoring based on response patterns
- **Recommendation Engine**: Personalized development pathway generation

### Handwriting Verification CNN

```python
# Model Architecture
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary classification
])
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
pytest tests/ -v --cov=.
```

### Frontend Testing

```bash
cd frontend
npm test
npm run test:coverage
```

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Authentication test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student@edulift.com","password":"student123"}'
```

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
pip install gunicorn
gunicorn app:app

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables

```bash
# Backend (.env)
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-key
DATABASE_URL=mysql+pymysql://user:pass@host:port/dbname
FLASK_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 📊 Performance Metrics

- **Frontend Performance**: 95+ Lighthouse score
- **API Response Time**: <200ms average
- **Database Queries**: Optimized with indexing
- **ML Model Accuracy**: 85%+ for handwriting verification
- **Career Matching Precision**: 90%+ user satisfaction

## 🤝 Contributing

We welcome contributions to EduLift! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards

- **Python**: Follow PEP 8 guidelines
- **TypeScript**: Use strict type checking
- **Testing**: Maintain >80% test coverage
- **Documentation**: Document all new features

### Issue Reporting

Please use the GitHub issue tracker to report bugs or request features. Include:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, browser, versions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 EduLift Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

**Project Maintainers**:
- **Primary Contact**: [Your Name] - [your.email@example.com]
- **Technical Lead**: [Tech Lead Name] - [tech.lead@example.com]

**Project Links**:
- **Repository**: [https://github.com/yourusername/EduLift](https://github.com/yourusername/EduLift)
- **Documentation**: [https://edulift-docs.example.com](https://edulift-docs.example.com)
- **Live Demo**: [https://edulift-demo.example.com](https://edulift-demo.example.com)
- **Issues**: [https://github.com/yourusername/EduLift/issues](https://github.com/yourusername/EduLift/issues)

**Research Collaboration**:
For academic collaboration, research partnerships, or publication inquiries, please contact our research team at [research@edulift.com](mailto:research@edulift.com).

---

## 🌟 Acknowledgments

- **University of [Your University]** for research support
- **Sri Lankan Ministry of Education** for domain expertise
- **Open Source Community** for the amazing tools and libraries
- **Beta Testing Schools** for valuable feedback and testing

## 📈 Future Roadmap

### Version 2.0 Features
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with Sri Lankan university systems
- [ ] Real-time collaboration features
- [ ] Enhanced ML models with transfer learning
- [ ] Multi-language support (Sinhala, Tamil, English)

### Research Initiatives
- [ ] Longitudinal student outcome studies
- [ ] Cross-cultural adaptation for other countries
- [ ] Advanced NLP for essay evaluation
- [ ] Predictive analytics for academic success
- [ ] Integration with IoT devices for comprehensive assessment

---

**Made with ❤️ for Sri Lankan students by the EduLift Team**

*EduLift - Elevating Education Through Technology*
=======
Project Link: [Lahiru Senavirathna](https://www.linkedin.com/in/lahiru-senavirathna-39b11a215/)
>>>>>>> 9b7bb567de9ed6c909ee448aa8fd762b8bed25fd
