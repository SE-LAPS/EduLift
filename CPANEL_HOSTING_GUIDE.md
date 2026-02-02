# 🚀 EduLift cPanel Hosting Guide

> ⚡ **QUICK START:** For a concise, single-page deployment guide, see **[SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)** (recommended for most users)

Complete step-by-step guide to deploy the EduLift platform (Frontend + Backend + Database) on cPanel shared hosting.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Phase 1: Database Setup](#phase-1-database-setup-mysql)
5. [Phase 2: Backend Deployment](#phase-2-backend-deployment-python-flask)
6. [Phase 3: Frontend Deployment](#phase-3-frontend-deployment-nextjs)
7. [Phase 4: Domain Configuration](#phase-4-domain-configuration)
8. [Phase 5: Testing & Verification](#phase-5-testing--verification)
9. [Environment Variables Reference](#environment-variables-reference)
10. [Troubleshooting](#troubleshooting)
11. [Performance Optimization](#performance-optimization)
12. [Security Best Practices](#security-best-practices)

---

## 📊 Project Overview

### Technology Stack Analysis

**Frontend:**
- Framework: Next.js 14.0.3 with TypeScript
- UI Library: Material-UI (MUI) v5.17.1
- State Management: React Context API
- HTTP Client: Axios
- Build Output: Static/Server-side rendered pages

**Backend:**
- Framework: Flask 2.3.3 (Python 3.8+)
- Database ORM: SQLAlchemy
- Authentication: JWT (Flask-JWT-Extended)
- Server: Gunicorn (production WSGI server)
- Dependencies: TensorFlow, scikit-learn, NumPy, Pandas, Pillow

**Database:**
- Primary: MySQL 5.7+ (via cPanel)
- Connection: PyMySQL driver
- Tables: users, tests, exams, handwriting samples, etc.

---

## 🔧 Prerequisites

### What You Need Before Starting

✅ **Hosting Account:**
- cPanel hosting account with:
  - Python 3.8+ support (or ability to install via Setup Python App)
  - Node.js 16+ support (or SSH access)
  - MySQL database access
  - Sufficient storage (minimum 2GB recommended)
  - Memory: 512MB+ RAM allocated to Python app

✅ **Access Credentials:**
- cPanel login credentials
- FTP/SFTP credentials or SSH access
- Domain name (e.g., yourdomain.com)

✅ **Local Development Tools:**
- Git installed
- Python 3.8+
- Node.js 16+
- Terminal/Command Line access

✅ **Project Files:**
- Complete EduLift project from your repository
- All source code files from `g:\EduLift\EduLift\`

---

## 🏗️ Architecture Overview

### Deployment Structure on cPanel

```
yourdomain.com (Root Domain)
├── public_html/                    # Frontend (Next.js build)
│   ├── _next/                      # Next.js static files
│   ├── index.html                  # Entry point
│   └── ...
│
├── backend/                        # Backend API (Flask)
│   ├── app.py                      # Main Flask application
│   ├── config.py                   # Configuration
│   ├── models/                     # Database models
│   ├── routes/                     # API endpoints
│   ├── uploads/                    # User uploads
│   ├── ml_models/                  # ML models
│   ├── venv/                       # Python virtual environment
│   └── passenger_wsgi.py           # cPanel app entry point
│
└── MySQL Database
    ├── edulift_prod                # Production database
    └── Tables (users, tests, exams, etc.)
```

### URL Structure

- **Frontend**: `https://yourdomain.com/`
- **Backend API**: `https://yourdomain.com:5000/api/` or `https://api.yourdomain.com/api/`
- **Database**: Accessed internally via localhost

---

## Phase 1: Database Setup (MySQL)

### Step 1.1: Create MySQL Database

1. **Login to cPanel**
   - Navigate to: `https://yourdomain.com:2083` or `https://yourdomain.com/cpanel`
   - Enter your cPanel credentials

2. **Access MySQL Databases**
   - In cPanel, find **"MySQL® Databases"** (usually under "Databases" section)
   - Click to open

3. **Create New Database**
   - Under "Create New Database"
   - Database name: `edulift_prod` (cPanel may prefix with your username, e.g., `username_edulift_prod`)
   - Click **"Create Database"**
   - Note the full database name (with prefix)

4. **Create Database User**
   - Scroll to "MySQL Users" section
   - Under "Add New User"
   - Username: `edulift_user`
   - Password: Generate a strong password (click "Password Generator")
   - **IMPORTANT**: Save this password securely
   - Click **"Create User"**

5. **Assign User to Database**
   - Scroll to "Add User To Database"
   - Select User: `edulift_user`
   - Select Database: `edulift_prod`
   - Click **"Add"**

6. **Set Privileges**
   - Check **"ALL PRIVILEGES"**
   - Click **"Make Changes"**

### Step 1.2: Note Database Connection Details

Save these details - you'll need them for backend configuration:

```
Database Host: localhost (or IP provided by cPanel)
Database Name: username_edulift_prod (with cPanel prefix)
Database User: username_edulift_user
Database Password: [the password you generated]
Database Port: 3306 (default)
```

### Step 1.3: Access phpMyAdmin (Optional Verification)

1. In cPanel, find **"phpMyAdmin"**
2. Click to open
3. Select your database from the left sidebar
4. Verify it's empty (ready for tables)

---

## Phase 2: Backend Deployment (Python Flask)

### Step 2.1: Prepare Backend Files Locally

1. **Open Terminal/Command Prompt**
   ```bash
   cd g:\EduLift\EduLift\backend
   ```

2. **Create Production Configuration File**
   
   Create a file named `passenger_wsgi.py` in the backend directory:
   
   ```python
   """
   cPanel Passenger WSGI Entry Point for EduLift Backend
   This file is required by cPanel's Python application hosting
   """
   import sys
   import os
   
   # Add your application directory to the Python path
   sys.path.insert(0, os.path.dirname(__file__))
   
   # Load environment variables
   from dotenv import load_dotenv
   load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
   
   # Import and configure the Flask application
   from app import create_app
   
   # Create the application instance
   application = create_app('production')
   
   # This is what cPanel Passenger will use
   if __name__ == '__main__':
       application.run()
   ```

3. **Update requirements.txt for Production**
   
   Ensure your `requirements.txt` includes all necessary packages:
   
   ```txt
   Flask==2.3.3
   Flask-RESTful==0.3.10
   Flask-SQLAlchemy==3.1.1
   Flask-Migrate==4.0.5
   Flask-Cors==4.0.0
   Flask-JWT-Extended==4.5.3
   PyMySQL==1.1.0
   python-dotenv==1.0.0
   Werkzeug==2.3.7
   gunicorn==21.2.0
   tensorflow==2.16.1
   scikit-learn==1.3.2
   numpy==1.26.0
   pandas==2.1.1
   Pillow==10.1.0
   bcrypt==4.0.1
   ```
   
   **NOTE**: TensorFlow 2.16.1 is quite large (~500MB). If your cPanel has storage limitations, consider:
   - Using TensorFlow Lite
   - Hosting ML features separately
   - Removing ML features if not critical for initial deployment

4. **Create Production Environment File**
   
   Create `.env.production` file (you'll edit values after database setup):
   
   ```env
   # Flask Configuration
   FLASK_ENV=production
   SECRET_KEY=GENERATE_STRONG_SECRET_KEY_HERE
   JWT_SECRET_KEY=GENERATE_STRONG_JWT_KEY_HERE
   
   # Database Configuration (cPanel MySQL)
   DATABASE_URL=mysql+pymysql://username_edulift_user:YOUR_PASSWORD@localhost:3306/username_edulift_prod
   
   # API Configuration
   PORT=5000
   FRONTEND_URL=https://yourdomain.com
   
   # Admin Configuration
   ADMIN_PASSWORD=your_secure_admin_password
   
   # File Upload
   MAX_CONTENT_LENGTH=16777216
   ```

5. **Generate Strong Secret Keys**
   
   Run these commands to generate secure keys:
   
   ```bash
   # Generate SECRET_KEY
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Generate JWT_SECRET_KEY
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   
   Copy these values and update your `.env.production` file.

### Step 2.2: Upload Backend Files to cPanel

#### Option A: Using File Manager (Easier)

1. **Compress Backend Files**
   ```bash
   # On Windows
   # Right-click on backend folder → Send to → Compressed (zipped) folder
   
   # Or use 7-Zip/WinRAR to create backend.zip
   ```

2. **Upload via cPanel File Manager**
   - Login to cPanel
   - Open **"File Manager"**
   - Navigate to your home directory (NOT public_html)
   - Click **"Upload"**
   - Upload `backend.zip`
   - Right-click the uploaded file → **"Extract"**
   - Rename extracted folder to `backend` if needed

#### Option B: Using FTP/SFTP (Recommended for Large Files)

1. **Use FileZilla or WinSCP**
   - Host: Your domain or server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Upload Backend Directory**
   - Navigate to home directory (e.g., `/home/yourusername/`)
   - Upload entire `backend` folder
   - Ensure all files are uploaded correctly

### Step 2.3: Configure Python Application in cPanel

1. **Access Setup Python App**
   - In cPanel, find **"Setup Python App"** (under Software section)
   - Click to open

2. **Create New Python Application**
   - Click **"Create Application"**
   - Configure as follows:

   ```
   Python Version: 3.8 or higher (select highest available)
   Application Root: backend
   Application URL: yourdomain.com (or leave empty for root)
   Application Startup File: passenger_wsgi.py
   Application Entry Point: application
   Passenger Log File: (leave default)
   ```

3. **Click "Create"**
   - cPanel will create a virtual environment
   - This may take a few minutes

### Step 2.4: Install Python Dependencies

1. **In Setup Python App Interface**
   - Find your newly created application
   - Copy the command to enter the virtual environment
   - It will look like:
     ```bash
     source /home/yourusername/virtualenv/backend/3.8/bin/activate && cd /home/yourusername/backend
     ```

2. **Access Terminal in cPanel**
   - In cPanel, find **"Terminal"** (under Advanced section)
   - Click to open terminal

3. **Activate Virtual Environment and Install Dependencies**
   ```bash
   # Activate the virtual environment (use the command from Step 1)
   source /home/yourusername/virtualenv/backend/3.8/bin/activate
   
   # Navigate to backend directory
   cd /home/yourusername/backend
   
   # Upgrade pip
   pip install --upgrade pip
   
   # Install dependencies (this may take 10-30 minutes)
   pip install -r requirements.txt
   ```

   **IMPORTANT**: 
   - If TensorFlow installation fails due to storage/memory limits:
     ```bash
     # Remove TensorFlow from requirements.txt first, then:
     pip install -r requirements.txt
     # You can add TensorFlow later or use a lighter alternative
     ```

4. **Set Environment Variables**
   ```bash
   # Create .env file
   nano .env
   
   # Or copy from .env.production
   cp .env.production .env
   ```

5. **Edit .env file**
   - Update DATABASE_URL with your actual database credentials
   - Ensure SECRET_KEY and JWT_SECRET_KEY are set
   - Update FRONTEND_URL to your actual domain

### Step 2.5: Initialize Database

1. **Still in Terminal, run database setup**
   ```bash
   # Make sure virtual environment is activated
   source /home/yourusername/virtualenv/backend/3.8/bin/activate
   cd /home/yourusername/backend
   
   # Run database initialization
   python setup_db.py
   ```

2. **Verify Database Tables**
   - Go to cPanel → phpMyAdmin
   - Select your database
   - You should see tables: users, tests, exams, etc.
   - Check users table for demo accounts

### Step 2.6: Configure Backend URL (Subdomain Approach)

For better organization, create a subdomain for your API:

1. **Create Subdomain in cPanel**
   - Go to **"Subdomains"** in cPanel
   - Subdomain: `api`
   - Domain: `yourdomain.com`
   - Document Root: `/home/yourusername/backend/public`
   - Click **"Create"**

2. **Create Public Directory**
   ```bash
   cd /home/yourusername/backend
   mkdir public
   ```

3. **Update Application URL**
   - Go back to **"Setup Python App"**
   - Edit your application
   - Application URL: `api.yourdomain.com`
   - Click **"Save"**

### Step 2.7: Test Backend API

1. **Restart Application**
   - In "Setup Python App", click **"Restart"** button

2. **Test Health Endpoint**
   - Visit: `https://api.yourdomain.com/api/health`
   - Or: `https://yourdomain.com:5000/api/health`
   - Expected response:
     ```json
     {
       "status": "healthy",
       "message": "EduLift API is running"
     }
     ```

3. **Test Root Endpoint**
   - Visit: `https://api.yourdomain.com/`
   - Should return API information with available endpoints

---

## Phase 3: Frontend Deployment (Next.js)

### Step 3.1: Build Frontend Locally

1. **Navigate to Frontend Directory**
   ```bash
   cd g:\EduLift\EduLift\frontend
   ```

2. **Create Production Environment File**
   
   Create `.env.production` in frontend directory:
   
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```
   
   This creates an optimized production build in the `.next` directory.

5. **Export Static Files (if possible)**
   
   Next.js 14 with dynamic routes requires server-side rendering. However, for cPanel, we'll need to work around this:
   
   **Option A: Static Export (Limited functionality)**
   ```bash
   npm run build
   # Manually copy .next/static and public folders
   ```
   
   **Option B: Custom Server (Recommended)**
   
   Create `server.js` in frontend directory:
   
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')
   
   const dev = false // Always production on server
   const hostname = 'localhost'
   const port = parseInt(process.env.PORT || '3000', 10)
   
   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()
   
   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true)
         await handle(req, res, parsedUrl)
       } catch (err) {
         console.error('Error occurred handling', req.url, err)
         res.statusCode = 500
         res.end('internal server error')
       }
     }).listen(port, (err) => {
       if (err) throw err
       console.log(`> Ready on http://${hostname}:${port}`)
     })
   })
   ```

### Step 3.2: Upload Frontend to cPanel

#### Option A: Static Files Only (Simpler, but limited features)

1. **Prepare Static Files**
   ```bash
   # In frontend directory
   # Create a folder called 'dist'
   mkdir dist
   
   # Copy necessary files
   cp -r .next/static dist/static
   cp -r public/* dist/
   ```

2. **Upload to public_html**
   - Use cPanel File Manager or FTP
   - Navigate to `public_html`
   - Upload all files from `dist` directory
   - Ensure `index.html` is in the root

#### Option B: Full Next.js with Node.js (Recommended)

**Note**: This requires Node.js support on your cPanel. Check if your hosting supports Node.js applications.

1. **Upload Frontend Directory**
   - Upload entire frontend folder to your home directory
   - Path: `/home/yourusername/frontend/`

2. **Setup Node.js Application in cPanel**
   - If available, go to **"Setup Node.js App"**
   - Create application:
     ```
     Node.js Version: 16.x or higher
     Application Mode: Production
     Application Root: frontend
     Application URL: yourdomain.com
     Application Startup File: server.js
     ```

3. **Install Dependencies via Terminal**
   ```bash
   cd /home/yourusername/frontend
   npm install --production
   ```

4. **Set Environment Variables in Node.js App**
   - In Setup Node.js App interface
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
     NEXT_PUBLIC_USE_MOCK=false
     ```

5. **Restart Application**

#### Option C: Static Export with Custom Routing (Compromise)

If full Node.js isn't supported, but you need some dynamic features:

1. **Modify next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     trailingSlash: true,
   }
   
   module.exports = nextConfig
   ```

2. **Build Static Export**
   ```bash
   npm run build
   ```
   
   This creates an `out` directory with static HTML files.

3. **Upload `out` Directory Contents**
   - Upload all files from `out/` to `public_html/`

4. **Create .htaccess for URL Rewriting**
   
   In `public_html/`, create `.htaccess`:
   
   ```apache
   # Enable Rewrite Engine
   RewriteEngine On
   
   # Force HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   
   # Handle Next.js routes
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   
   # Serve static files from _next directory
   RewriteCond %{REQUEST_FILENAME} -f
   RewriteRule ^_next/(.*)$ _next/$1 [L]
   ```

### Step 3.3: Update API Configuration

Ensure your frontend can communicate with the backend:

1. **Verify CORS Configuration**
   - The backend's `app.py` should have CORS enabled
   - Check that your domain is allowed:
     ```python
     CORS(app, resources={r"/api/*": {
         "origins": ["https://yourdomain.com", "https://www.yourdomain.com"],
         "supports_credentials": True
     }})
     ```

2. **Update Backend .env**
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Restart Backend Application**
   - Go to Setup Python App
   - Click "Restart"

---

## Phase 4: Domain Configuration

### Step 4.1: Configure Main Domain

1. **Set Document Root (if needed)**
   - Go to cPanel → **"Domains"**
   - Find your domain
   - Click **"Manage"**
   - Document Root: `/home/yourusername/public_html`

2. **Force HTTPS**
   - In cPanel, go to **"SSL/TLS Status"**
   - Select your domain
   - Click **"Run AutoSSL"**
   - Once SSL is active, add redirect in .htaccess (already included above)

### Step 4.2: Configure Subdomain for API

1. **Verify Subdomain Settings**
   - Go to cPanel → **"Subdomains"**
   - Ensure `api.yourdomain.com` points to `/home/yourusername/backend/public`

2. **SSL for Subdomain**
   - Go to **"SSL/TLS Status"**
   - Enable SSL for `api.yourdomain.com`

### Step 4.3: DNS Configuration (if external domain)

If your domain is registered elsewhere:

1. **Update Nameservers**
   - Point to your hosting provider's nameservers (provided by host)
   - Wait for propagation (up to 48 hours)

2. **Or Update A Records**
   - A Record: `@` → Your server IP
   - A Record: `www` → Your server IP
   - A Record: `api` → Your server IP

---

## Phase 5: Testing & Verification

### Step 5.1: Backend Testing

1. **Health Check**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```
   Expected: `{"status": "healthy", "message": "EduLift API is running"}`

2. **Test Authentication**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin@edulift.com","password":"admin123"}'
   ```
   Expected: JWT token in response

3. **Test Database Connection**
   - Login to phpMyAdmin
   - Check if `users` table has entries
   - Verify demo accounts exist

### Step 5.2: Frontend Testing

1. **Access Website**
   - Visit: `https://yourdomain.com`
   - Page should load without errors

2. **Test Login**
   - Navigate to login page
   - Use demo credentials:
     - Admin: admin@edulift.com / admin123
     - Student: student@edulift.com / student123

3. **Check Browser Console**
   - Press F12 → Console tab
   - Verify no CORS errors
   - Check API calls are successful

### Step 5.3: Integration Testing

1. **Test User Registration**
   - Register a new user
   - Verify user appears in database

2. **Test File Upload**
   - Try uploading a profile picture
   - Check uploads directory on server

3. **Test Dashboard**
   - Login and access dashboard
   - Verify data loads correctly

4. **Test Career Guidance** (if ML models are functional)
   - Navigate to career guidance
   - Complete assessment

---

## 🔐 Environment Variables Reference

### Backend (.env)

```env
# Flask Environment
FLASK_ENV=production

# Security Keys (REQUIRED - generate unique values)
SECRET_KEY=your-super-secure-secret-key-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars

# Database Configuration (cPanel MySQL)
DATABASE_URL=mysql+pymysql://username_edulift_user:password@localhost:3306/username_edulift_prod

# API Configuration
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Admin Configuration
ADMIN_PASSWORD=secure_admin_password

# File Uploads
MAX_CONTENT_LENGTH=16777216

# JWT Configuration (optional)
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# Redis (if available)
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env.production)

```env
# API Endpoint
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Feature Flags
NEXT_PUBLIC_USE_MOCK=false

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 🛠️ Troubleshooting

### Database Issues

**Problem**: Can't connect to database

**Solution**:
1. Verify database credentials in `.env`
2. Check if database exists in phpMyAdmin
3. Ensure user has correct privileges
4. Confirm database name includes cPanel prefix
5. Test connection:
   ```bash
   python -c "import pymysql; pymysql.connect(host='localhost', user='user', password='pass', db='dbname')"
   ```

**Problem**: Tables not created

**Solution**:
1. Run setup script manually:
   ```bash
   source /home/yourusername/virtualenv/backend/3.8/bin/activate
   cd /home/yourusername/backend
   python setup_db.py
   ```
2. Check for errors in output
3. Verify SQLAlchemy models are correct

### Backend Issues

**Problem**: 500 Internal Server Error

**Solution**:
1. Check error logs:
   - cPanel → Errors
   - Or: `/home/yourusername/logs/`
2. Verify passenger_wsgi.py is correct
3. Check Python version compatibility
4. Ensure all dependencies installed:
   ```bash
   pip list | grep Flask
   ```
5. Test application manually:
   ```bash
   python app.py
   ```

**Problem**: Module not found errors

**Solution**:
1. Activate virtual environment
2. Reinstall requirements:
   ```bash
   pip install -r requirements.txt --upgrade
   ```
3. Check Python path in passenger_wsgi.py

**Problem**: TensorFlow installation fails

**Solution**:
1. TensorFlow is large (~500MB) and may exceed cPanel limits
2. Options:
   - Request hosting provider to increase limits
   - Use TensorFlow Lite instead
   - Deploy ML features on separate service (AWS Lambda, Google Cloud Functions)
   - Remove ML features temporarily:
     ```bash
     # Comment out in requirements.txt
     # tensorflow==2.16.1
     ```

### Frontend Issues

**Problem**: White screen or blank page

**Solution**:
1. Check browser console (F12)
2. Verify API URL is correct in environment variables
3. Check if static files are uploaded correctly
4. Clear browser cache
5. Verify .htaccess rewrite rules

**Problem**: API calls failing (CORS errors)

**Solution**:
1. Update backend CORS configuration in `app.py`:
   ```python
   CORS(app, resources={r"/api/*": {
       "origins": ["https://yourdomain.com"],
       "methods": ["GET", "POST", "PUT", "DELETE"],
       "allow_headers": ["Content-Type", "Authorization"],
       "supports_credentials": True
   }})
   ```
2. Restart backend application
3. Clear browser cache

**Problem**: Images or static assets not loading

**Solution**:
1. Verify `_next/static` directory is uploaded
2. Check file permissions (755 for directories, 644 for files)
3. Update next.config.js:
   ```javascript
   assetPrefix: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : ''
   ```

### SSL Issues

**Problem**: SSL certificate not working

**Solution**:
1. Go to cPanel → SSL/TLS Status
2. Run AutoSSL for your domain
3. Wait for certificate generation
4. Force HTTPS in .htaccess

**Problem**: Mixed content warnings

**Solution**:
1. Ensure all resources (API, images) use HTTPS
2. Update API URL to use HTTPS
3. Check external resources (CDNs) use HTTPS

### Performance Issues

**Problem**: Slow API response

**Solution**:
1. Enable database query optimization
2. Add indexes to frequently queried columns:
   ```sql
   CREATE INDEX idx_username ON users(username);
   CREATE INDEX idx_email ON users(email);
   ```
3. Enable caching (Redis if available)
4. Optimize SQLAlchemy queries

**Problem**: High memory usage

**Solution**:
1. Check for memory leaks in code
2. Limit concurrent connections
3. Use pagination for large datasets
4. Consider upgrading hosting plan

---

## ⚡ Performance Optimization

### Backend Optimization

1. **Database Indexing**
   ```sql
   -- Add indexes for common queries
   ALTER TABLE users ADD INDEX idx_username (username);
   ALTER TABLE users ADD INDEX idx_email (email);
   ALTER TABLE tests ADD INDEX idx_created_by (created_by);
   ```

2. **Query Optimization**
   - Use lazy loading for relationships
   - Implement pagination for large datasets
   - Use select_related for foreign keys

3. **Caching** (if Redis available)
   ```python
   from flask_caching import Cache
   cache = Cache(app, config={'CACHE_TYPE': 'redis'})
   
   @cache.cached(timeout=300)
   def get_user_data(user_id):
       return User.query.get(user_id)
   ```

4. **Gunicorn Configuration**
   - Workers: `(2 * CPU_cores) + 1`
   - Threads: 2-4
   - Worker class: sync (default) or gevent for async

### Frontend Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Compress images before upload
   - Use WebP format

2. **Code Splitting**
   - Dynamic imports for heavy components
   ```javascript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

3. **CDN Integration**
   - Use Cloudflare or similar CDN
   - Cache static assets
   - Enable gzip compression

4. **Lazy Loading**
   - Implement infinite scroll
   - Load components on demand

### Database Optimization

1. **Connection Pooling**
   ```python
   # In config.py
   SQLALCHEMY_POOL_SIZE = 10
   SQLALCHEMY_POOL_RECYCLE = 3600
   SQLALCHEMY_POOL_TIMEOUT = 30
   ```

2. **Query Analysis**
   - Use EXPLAIN to analyze slow queries
   - Add composite indexes where needed

3. **Regular Maintenance**
   ```sql
   -- Optimize tables monthly
   OPTIMIZE TABLE users;
   OPTIMIZE TABLE tests;
   ```

---

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit `.env` files
- Use strong, random secret keys
- Rotate keys periodically
- Store backups securely

### 2. Database Security

- Use strong database passwords
- Limit database user privileges
- Regular backups (automate if possible)
- Enable MySQL binary logging

### 3. Application Security

- Keep all dependencies updated
- Implement rate limiting:
  ```python
  from flask_limiter import Limiter
  limiter = Limiter(app, key_func=lambda: request.remote_addr)
  
  @app.route('/api/login')
  @limiter.limit("5 per minute")
  def login():
      pass
  ```
- Sanitize user inputs
- Use prepared statements (SQLAlchemy does this)
- Implement CSRF protection

### 4. SSL/TLS

- Force HTTPS everywhere
- Use HSTS headers:
  ```python
  @app.after_request
  def set_secure_headers(response):
      response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
      return response
  ```

### 5. File Upload Security

- Validate file types
- Limit file sizes
- Scan for malware (if possible)
- Store uploads outside web root
- Use secure filenames:
  ```python
  from werkzeug.utils import secure_filename
  filename = secure_filename(uploaded_file.filename)
  ```

### 6. Access Control

- Implement proper role-based access
- Verify JWT tokens on every request
- Use refresh token rotation
- Implement session timeout

### 7. Monitoring

- Enable error logging
- Monitor failed login attempts
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Regular security audits

### 8. Backup Strategy

1. **Database Backups**
   - Daily automated backups
   - Store off-server (Google Drive, Dropbox)
   - Test restore process regularly

2. **Code Backups**
   - Use Git for version control
   - Keep production branch clean
   - Tag releases

3. **Backup Script** (cron job)
   ```bash
   #!/bin/bash
   # Daily backup script
   DATE=$(date +%Y%m%d)
   mysqldump -u username -p'password' dbname > /backups/edulift_$DATE.sql
   gzip /backups/edulift_$DATE.sql
   # Upload to cloud storage
   ```

---

## 📊 Maintenance Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Verify backup completed

### Weekly
- [ ] Review performance metrics
- [ ] Check disk space usage
- [ ] Review security logs
- [ ] Test critical features

### Monthly
- [ ] Update dependencies (test first!)
- [ ] Optimize database
- [ ] Review and rotate logs
- [ ] Security audit
- [ ] Test backup restoration

### Quarterly
- [ ] Update SSL certificates (if manual)
- [ ] Major version updates
- [ ] Performance optimization review
- [ ] User feedback implementation

---

## 📞 Support & Resources

### Hosting Provider Support

Contact your cPanel hosting provider for:
- Server configuration issues
- Resource limit increases
- SSL certificate problems
- Database access issues

### EduLift Resources

- **Project Repository**: Your Git repository
- **Documentation**: README.md files in project
- **Setup Guides**: SETUP_GUIDE.md, XAMPP_MYSQL_SETUP.md

### Useful Commands Reference

```bash
# Activate Python virtual environment
source /home/yourusername/virtualenv/backend/3.8/bin/activate

# Install Python package
pip install package-name

# Check Python packages
pip list

# Database backup
mysqldump -u user -p dbname > backup.sql

# Restore database
mysql -u user -p dbname < backup.sql

# Check disk usage
du -sh /home/yourusername/*

# Check running processes
ps aux | grep python

# View log files
tail -f /home/yourusername/logs/error.log
```

---

## ✅ Deployment Success Checklist

### Backend
- [ ] Database created and user assigned
- [ ] Backend files uploaded to server
- [ ] Python application configured in cPanel
- [ ] Dependencies installed successfully
- [ ] .env file configured with production values
- [ ] Database initialized with tables and demo data
- [ ] passenger_wsgi.py present and configured
- [ ] Backend health endpoint responding
- [ ] API authentication working
- [ ] CORS configured correctly

### Frontend
- [ ] Frontend built successfully
- [ ] Files uploaded to public_html (or frontend directory)
- [ ] Environment variables set
- [ ] Static assets loading correctly
- [ ] API connection working
- [ ] Login functionality working
- [ ] Dashboard accessible
- [ ] No console errors

### Domain & SSL
- [ ] Domain pointing to correct server
- [ ] SSL certificate active and valid
- [ ] HTTPS redirect working
- [ ] Subdomain (api.) configured
- [ ] Both www and non-www working

### Security
- [ ] Strong secret keys generated
- [ ] Database user has limited privileges
- [ ] .env files not publicly accessible
- [ ] File upload directory secure
- [ ] Rate limiting implemented (optional)
- [ ] Error messages don't expose sensitive info

### Testing
- [ ] User registration working
- [ ] Login/logout working
- [ ] Profile management working
- [ ] Test creation/management working (if applicable)
- [ ] File uploads working
- [ ] All major features tested

---

## 🎉 Congratulations!

If you've completed all steps, your EduLift platform is now successfully hosted on cPanel!

### What's Next?

1. **Change Default Passwords**
   - Admin account
   - Database user
   - Demo accounts

2. **Customize Content**
   - Update branding
   - Add your content
   - Configure settings

3. **Monitor Performance**
   - Set up monitoring tools
   - Track user activity
   - Optimize based on usage

4. **User Onboarding**
   - Create user documentation
   - Set up support system
   - Begin user registration

5. **Continuous Improvement**
   - Collect user feedback
   - Fix bugs promptly
   - Add new features
   - Keep system updated

### Need Help?

- Review troubleshooting section
- Check cPanel error logs
- Contact hosting support
- Review project documentation
- Test components individually

---

**Made with ❤️ for EduLift Platform**

*Last Updated: January 2026*
