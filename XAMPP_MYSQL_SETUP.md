# EduLift with XAMPP MySQL Setup Guide

This guide will help you configure EduLift to use MySQL database via XAMPP instead of SQLite or PostgreSQL.

## 🎯 Why MySQL with XAMPP?

- ✅ Easy local development setup
- ✅ phpMyAdmin for database management
- ✅ Production-like environment
- ✅ Better performance for larger datasets
- ✅ Multi-user support

## 📋 Prerequisites

1. **XAMPP installed** (https://www.apachefriends.org/download.html)
2. **Python 3.8+** installed
3. **Node.js 16+** installed

## 🚀 Step-by-Step Setup

### Step 1: Install and Start XAMPP

1. **Download XAMPP** from https://www.apachefriends.org/download.html
2. **Install XAMPP** following the installer instructions
3. **Start XAMPP Control Panel**
4. **Start these services:**
   - ✅ Apache (for phpMyAdmin)
   - ✅ MySQL (for database)

**XAMPP Control Panel should show:**
```
Apache: Running on port 80
MySQL: Running on port 3306
```

### Step 2: Create MySQL Databases

1. **Open phpMyAdmin**: http://localhost/phpmyadmin
2. **Click "New" in the left sidebar**
3. **Create development database:**
   - Database name: `edulift_dev`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"
4. **Create test database:**
   - Database name: `edulift_test`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

### Step 3: Update EduLift Configuration

1. **Install MySQL driver:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create/Update .env file:**
   ```bash
   # Copy the example (if it doesn't exist)
   copy .env.example .env   # Windows
   cp .env.example .env     # macOS/Linux
   ```

3. **Configure .env file:**
   ```env
   # Flask Configuration
   FLASK_ENV=development
   SECRET_KEY=your-super-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here

   # MySQL Database Configuration (XAMPP)
   # Default XAMPP MySQL (no password for root)
   DEV_DATABASE_URL=mysql+pymysql://root:@localhost:3306/edulift_dev
   TEST_DATABASE_URL=mysql+pymysql://root:@localhost:3306/edulift_test

   # If you have set a MySQL root password:
   # DEV_DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/edulift_dev
   # TEST_DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/edulift_test

   # API Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

### Step 4: Initialize Database

1. **Run the setup script:**
   ```bash
   cd backend
   python setup_db.py
   ```

   **Expected output:**
   ```
   ✅ Database connection successful: mysql+pymysql://root:@localhost:3306/edulift_dev
   ✅ Database tables created successfully
   ✅ Admin user and sample users created successfully

   📋 Demo Login Credentials:
   Admin: admin@edulift.com / admin123
   Teacher: teacher@edulift.com / teacher123
   Student: student@edulift.com / student123
   Assistant: assistant@edulift.com / assistant123
   ```

### Step 5: Start the Application

**Option 1: Using the startup script:**
```bash
cd backend
python start.py
```

**Option 2: Manual start:**
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎯 Verification Steps

### 1. Check MySQL Connection
- Open phpMyAdmin: http://localhost/phpmyadmin
- You should see `edulift_dev` and `edulift_test` databases
- Click on `edulift_dev` → you should see tables like `users`, `tests`, etc.

### 2. Check Backend API
- Visit: http://localhost:5000/api/health
- Should return: `{"status": "healthy", "message": "EduLift API is running"}`

### 3. Check Frontend
- Visit: http://localhost:3000
- Login with demo credentials
- Check that profile and dashboard work

### 4. Verify Database Data
- In phpMyAdmin, click on `edulift_dev` → `users` table
- You should see the demo users created

## 🔧 Troubleshooting

### MySQL Connection Issues

**Error: "Can't connect to MySQL server"**
```bash
# Check if MySQL is running in XAMPP Control Panel
# Restart MySQL service if needed
```

**Error: "Access denied for user 'root'"**
```bash
# Check if you've set a MySQL password
# Update .env file with the correct password
```

**Error: "Unknown database 'edulift_dev'"**
```bash
# Create the databases in phpMyAdmin:
# 1. Open http://localhost/phpmyadmin
# 2. Click "New" → Create "edulift_dev"
# 3. Create "edulift_test"
```

### Port Conflicts

**XAMPP Apache won't start (Port 80 busy):**
```bash
# Change Apache port in XAMPP:
# 1. Click "Config" next to Apache
# 2. Select "httpd.conf"
# 3. Change "Listen 80" to "Listen 8080"
# 4. Access phpMyAdmin at: http://localhost:8080/phpmyadmin
```

**XAMPP MySQL won't start (Port 3306 busy):**
```bash
# Check what's using port 3306:
netstat -an | findstr 3306

# Stop other MySQL services or change XAMPP MySQL port
```

### Python Dependency Issues

**Error: "No module named 'pymysql'"**
```bash
cd backend
pip install PyMySQL==1.1.0
```

**Error: "ModuleNotFoundError: No module named '_mysql'"**
```bash
# PyMySQL is pure Python, this shouldn't happen
# Try reinstalling:
pip uninstall PyMySQL
pip install PyMySQL==1.1.0
```

## 🗄️ Database Management

### Using phpMyAdmin

1. **Access**: http://localhost/phpmyadmin
2. **Browse data**: Click database → table → "Browse"
3. **Edit data**: Click "Edit" icon next to any row
4. **Run SQL**: Click "SQL" tab to run custom queries
5. **Export data**: Click "Export" tab for backups

### Useful SQL Commands

```sql
-- View all users
SELECT * FROM users;

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Reset admin password
UPDATE users SET password_hash = '$2b$12$...' WHERE username = 'admin@edulift.com';

-- Delete test data
DELETE FROM users WHERE username LIKE '%test%';
```

## 📊 Database Schema

The setup creates these main tables:
- `users` - User accounts and profiles
- `tests` - Test definitions
- `test_questions` - Questions for tests
- `student_tests` - Student test attempts
- `exams` - Exam definitions
- `student_exams` - Student exam submissions

## 🔐 Security Notes

### For Development:
- Default XAMPP MySQL has no root password (fine for local dev)
- Demo users have simple passwords (change in production)

### For Production:
- Set strong MySQL root password
- Create dedicated MySQL user for EduLift
- Use environment variables for all credentials
- Enable MySQL SSL connections

## 🎉 Success Indicators

When everything is working correctly:

1. ✅ XAMPP shows MySQL running
2. ✅ phpMyAdmin accessible at http://localhost/phpmyadmin
3. ✅ `edulift_dev` and `edulift_test` databases exist
4. ✅ `python setup_db.py` runs without errors
5. ✅ Backend starts at http://localhost:5000
6. ✅ Frontend loads at http://localhost:3000
7. ✅ Login works with demo credentials
8. ✅ User data persists between sessions

## 🆘 Need Help?

If you encounter issues:

1. **Check XAMPP Control Panel** - ensure MySQL is running
2. **Check phpMyAdmin** - verify databases exist
3. **Check backend console** - look for error messages
4. **Verify .env file** - ensure correct database URL
5. **Try starting fresh** - restart XAMPP and Python server

## 🔄 Switching Back to SQLite

If you want to switch back to SQLite:

1. **Update config.py:**
   ```python
   SQLALCHEMY_DATABASE_URI = 'sqlite:///edulift_dev.db'
   ```

2. **Update requirements.txt:**
   ```txt
   # Remove: PyMySQL==1.1.0
   # No additional driver needed for SQLite
   ```

Your EduLift project is now configured to use MySQL via XAMPP! 🎉 