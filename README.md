# 🎓 EduLift

## Introduction

EduLift is a comprehensive platform designed to help Sri Lankan students after they finish their ordinary school examinations. It guides them in choosing the right career path, learning new skills, and finding opportunities like scholarships or jobs. The goal is to ensure they have a bright and successful future, no matter what they choose to do next.

## 📚 Table of Contents

- [Features](#features)
- [Key Technologies and Skills](#key-technologies-and-skills)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### User Management:
- **Add New Users**: Admins can onboard teachers, assistants, supersubs, and students
- **Update User Roles**: Admins control user roles and permissions
- **Password Management**: Admins can reset passwords for users
- **User Deletion and Inactivation**: Admins can delete or deactivate user accounts

### Deep Learning Model Management:
- **Model Training and Retraining**: Teachers can train CNN models with student handwriting data
- **Handwriting Verification**: Verify authenticity of student assessments and exam answer sheets

### Test Management:
- **Test Creation and Deployment**: Teachers can upload test questions and answers
- **Supersub Identification**: Recognize top-performing students based on concept scores

### Role and Marks Management:
- **Role Updates**: Teachers can update student roles to supersubs and assistants
- **Viewing Student Marks**: Teachers can review student marks in tests and exams
- **Mark Display Approval**: Teachers can approve exam marks for display in the student portal

### Test and Exam Participation:
- **Test Attendance and Submission**: Students can attend tests and submit answers
- **Answer Submission Process**: Students can submit assessment and exam answer sheets
- **Access to Marks**: Students can review their test and exam marks

### Exam Answer Sheet Management and Evaluation:
- **Collection and Upload**: Assistants and supersubs can collect, scan, and upload exam answer sheets
- **Answer Sheet Evaluation**: Assistants and supersubs can evaluate exam answer sheets
- **Multiple Evaluator System**: Each exam answer sheet is evaluated by multiple evaluators

## 👨‍💻 Key Technologies and Skills

- **Frontend**: React.js with Next.js for server-side rendering
- **Backend**: Python (Flask) for API and ML model integration
- **Database**: PostgreSQL for relational data, Redis for caching
- **Machine Learning**: TensorFlow/Keras for deep learning models, Scikit-learn for classical ML models
- **Deployment**: Cloud services with CI/CD for efficient updates
- **Security**: OAuth 2.0 authentication and secure encryption for sensitive data

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/EduLift.git

# Navigate to the project directory
cd EduLift

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Set up the database
cd ../backend
python setup_db.py

# Start the development servers
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Usage

1. Access the web application at `http://localhost:3000`
2. Log in with the default admin credentials:
   - Username: `admin@edulift.com`
   - Password: `admin123` (change this immediately after first login)
3. Set up user accounts for teachers, assistants, supersubs, and students
4. Begin using the platform according to your role

## Contributing

We welcome contributions to EduLift! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/EduLift](https://github.com/yourusername/EduLift)
