# EduLift Setup Guide

This guide will help you set up the EduLift project with proper database configuration and authentication.

## 🔧 Prerequisites

- Node.js (v16+ recommended)
- Python (v3.8+ recommended)
- PostgreSQL (v12+ recommended) OR SQLite (for development only)

## 📊 Database Setup Options

### Option 1: PostgreSQL (Recommended for Production & Development)

#### Installing PostgreSQL

**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port: 5432

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create a database user (optional)
createuser --interactive
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Setting Up PostgreSQL for EduLift

1. **Access PostgreSQL:**
   ```bash
   # Windows/macOS/Linux
   psql -U postgres
   ```

2. **Create Database and User:**
   ```sql
   -- Create a database for development
   CREATE DATABASE edulift_dev;
   
   -- Create a database for testing
   CREATE DATABASE edulift_test;
   
   -- Create a user for EduLift (optional)
   CREATE USER edulift_user WITH PASSWORD 'your_password_here';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE edulift_dev TO edulift_user;
   GRANT ALL PRIVILEGES ON DATABASE edulift_test TO edulift_user;
   
   -- Exit psql
   \q
   ```

### Option 2: SQLite (Development Only)

SQLite is already configured as a fallback and requires no additional setup.

## 🚀 Project Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

**For PostgreSQL:**
```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# PostgreSQL Database Configuration
DEV_DATABASE_URL=postgresql://edulift_user:your_password_here@localhost:5432/edulift_dev
TEST_DATABASE_URL=postgresql://edulift_user:your_password_here@localhost:5432/edulift_test

# API Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**For SQLite (fallback):**
```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# SQLite Database Configuration (fallback)
DEV_DATABASE_URL=sqlite:///edulift_dev.db
TEST_DATABASE_URL=sqlite:///edulift_test.db

# API Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Database Initialization

```bash
cd backend
python setup_db.py
```

This script will:
- ✅ Test database connection
- ✅ Create all necessary tables
- ✅ Create sample users for testing
- ✅ Display login credentials

### 4. Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_USE_MOCK=false
```

## 🏃‍♂️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
python app.py
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 Default User Accounts

After running `setup_db.py`, you'll have these demo accounts:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin@edulift.com | admin123 | Full system access |
| Teacher | teacher@edulift.com | teacher123 | Create tests, manage students |
| Student | student@edulift.com | student123 | Take tests, view progress |
| Assistant | assistant@edulift.com | assistant123 | Grade papers, support students |

## 🔧 Troubleshooting

### Database Connection Issues

**PostgreSQL Connection Failed:**
1. Ensure PostgreSQL is running:
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql  # Linux
   brew services list | grep postgresql  # macOS
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check connection string in `.env` file

**SQLite Permission Issues:**
1. Ensure the backend directory is writable
2. Check if `edulift_dev.db` exists in `backend/instance/`

### Common Errors

**"Module not found" errors:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

**Port already in use:**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**JWT Token errors:**
1. Clear browser localStorage
2. Restart the backend server
3. Check JWT_SECRET_KEY in `.env`

## 🔐 Security Notes

### For Production Deployment:

1. **Change Default Credentials:**
   - Update admin password immediately
   - Remove demo accounts

2. **Environment Variables:**
   - Use strong, unique SECRET_KEY and JWT_SECRET_KEY
   - Never commit .env files to version control

3. **Database Security:**
   - Use SSL connections for PostgreSQL
   - Restrict database user privileges
   - Regular backups

## 📚 Features Overview

### ✅ Working Features:
- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (Admin, Teacher, Student, Assistant, SuperSub)
- ✅ User Profile Management
- ✅ Database Persistence (PostgreSQL/SQLite)
- ✅ Responsive Dashboard
- ✅ API Documentation
- ✅ Password Hashing
- ✅ Session Management

### 🚧 Features in Development:
- Test Creation and Management
- Exam Evaluation System
- ML-based Handwriting Analysis
- Career Guidance System
- Talent Identification

## 🆘 Need Help?

1. **Check the console logs** for detailed error messages
2. **Verify environment variables** are correctly set
3. **Ensure all dependencies** are installed
4. **Check database connectivity** using the setup script

For additional support, check the project documentation or create an issue in the repository. 