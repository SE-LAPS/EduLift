# EduLift Backend - Simplified Startup Guide

## 🚀 Quick Start

The EduLift backend has been consolidated into a single startup file for easier development.

### Prerequisites
1. **XAMPP** - Make sure XAMPP is running with Apache & MySQL
2. **Python** - Python 3.7+ installed
3. **Dependencies** - Install requirements

### Simple Startup Process

#### 1. Frontend (Terminal 1)
```bash
cd frontend
npm run dev
```

#### 2. Backend (Terminal 2)
```bash
cd backend
python app.py
```

That's it! 🎉

### What happens when you run `python app.py`:

1. **Dependency Check** - Verifies all packages are installed
2. **Environment Check** - Checks for required environment variables
3. **Database Check** - Tests MySQL/XAMPP connection
4. **Database Setup** - Optionally initializes sample data
5. **Server Start** - Starts Flask development server

### Environment Configuration

If you don't have a `.env` file, the startup script will offer to create one from `.env.example`.

Required environment variables:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DEV_DATABASE_URL=mysql+pymysql://root:@localhost:3306/edulift_dev
PORT=5000
```

### Troubleshooting

If you encounter issues, the startup script provides helpful error messages and troubleshooting tips for:
- Missing dependencies
- Database connection problems
- XAMPP configuration issues

### Demo Credentials

The system includes demo accounts:
- **Admin**: admin@edulift.com / admin123
- **Teacher**: teacher@edulift.com / teacher123
- **Student**: student@edulift.com / student123

### What Changed?

Previously you needed to run:
- `python start.py` (startup checks)
- `python app.py` (Flask server)

Now you only need:
- `python app.py` (everything included!)

The old `start.py` file is still available as a backup, but `app.py` now includes all its functionality. 