# 🚀 EduLift cPanel Deployment - Step-by-Step Instructions

> ⚡ **QUICK START:** For a concise, single-page deployment guide, see **[SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)** (recommended for most users)

This document provides the **exact steps** to deploy your EduLift project on cPanel.

---

## 📦 PART 1: PREPARE FILES LOCALLY (On Your Computer)

### Step 1: Generate Security Keys

Open Terminal/Command Prompt and run:

```bash
# Generate SECRET_KEY
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# Generate JWT_SECRET_KEY
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

**Save these keys** - you'll need them in Step 4.

### Step 2: Configure Backend Environment

1. Navigate to backend folder:
   ```bash
   cd g:\EduLift\EduLift\backend
   ```

2. Copy the example file:
   ```bash
   copy .env.production.example .env
   ```

3. Edit `.env` file and update:
   - Replace `SECRET_KEY` with your generated key
   - Replace `JWT_SECRET_KEY` with your generated key
   - Update `DATABASE_URL` (you'll get database details from cPanel in Part 2)
   - Update `FRONTEND_URL` to your actual domain
   - Change `ADMIN_PASSWORD` to a secure password

### Step 3: Configure Frontend Environment

1. Navigate to frontend folder:
   ```bash
   cd g:\EduLift\EduLift\frontend
   ```

2. Copy the example file:
   ```bash
   copy .env.production.example .env.production
   ```

3. Edit `.env.production` file:
   - Update `NEXT_PUBLIC_API_URL` with your API subdomain
   - Update `NEXT_PUBLIC_SITE_URL` with your domain

### Step 4: Build Frontend

Still in frontend folder:

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `.next` folder with optimized files.

### Step 5: Create Deployment Packages

Create two ZIP files:

**Backend ZIP:**
```bash
# Compress the entire backend folder
# Include: app.py, config.py, models/, routes/, passenger_wsgi.py, .env, requirements.txt, setup_db.py
```

**Frontend ZIP:**
```bash
# Compress these folders/files from frontend:
# - .next/ folder (entire folder)
# - public/ folder (entire folder)
# - .htaccess file
# - package.json
# - next.config.js
```

---

## 🗄️ PART 2: DATABASE SETUP IN CPANEL

### Step 1: Login to cPanel

1. Go to: `https://yourdomain.com:2083`
2. Enter your cPanel credentials

### Step 2: Create MySQL Database

1. Find and click **"MySQL® Databases"**

2. **Create Database:**
   - Database Name: `edulift_prod`
   - Click **"Create Database"**
   - Note the full name (e.g., `cpanelusername_edulift_prod`)

3. **Create Database User:**
   - Username: `edulift_user`
   - Password: Click "Password Generator" for strong password
   - **SAVE THIS PASSWORD!**
   - Click **"Create User"**

4. **Add User to Database:**
   - User: Select `edulift_user`
   - Database: Select `edulift_prod`
   - Click **"Add"**
   - Check **"ALL PRIVILEGES"**
   - Click **"Make Changes"**

### Step 3: Note Your Database Credentials

```
Database Host: localhost
Database Name: cpanelusername_edulift_prod
Database User: cpanelusername_edulift_user
Database Password: [password you generated]
Database Port: 3306
```

### Step 4: Update Backend .env File

Now update your local backend `.env` file with the correct database connection:

```env
DATABASE_URL=mysql+pymysql://cpanelusername_edulift_user:YOUR_PASSWORD@localhost:3306/cpanelusername_edulift_prod
```

**Important:** Re-zip the backend folder with the updated .env file!

---

## 🐍 PART 3: BACKEND DEPLOYMENT

### Step 1: Upload Backend Files

1. In cPanel, open **"File Manager"**
2. Navigate to your **home directory** (NOT public_html)
   - Path: `/home/cpanelusername/`
3. Click **"Upload"**
4. Upload your `backend.zip` file
5. Wait for upload to complete
6. Right-click `backend.zip` → **"Extract"**
7. Delete the ZIP file after extraction

### Step 2: Verify Backend Structure

In File Manager, verify this structure:
```
/home/cpanelusername/backend/
├── app.py
├── passenger_wsgi.py  ← Important!
├── config.py
├── .env               ← Must be present with correct values
├── requirements.txt
├── setup_db.py
├── models/
├── routes/
├── uploads/
└── ml_models/
```

### Step 3: Setup Python Application

1. In cPanel, find **"Setup Python App"**
2. Click **"Create Application"**
3. Fill in the form:

   ```
   Python Version: 3.8 (or highest available - 3.9, 3.10, 3.11)
   Application Root: backend
   Application URL: [leave empty or yourdomain.com]
   Application Startup File: passenger_wsgi.py
   Application Entry Point: application
   ```

4. Click **"Create"**
5. Wait for virtual environment creation (2-5 minutes)

### Step 4: Install Python Dependencies

1. In the Python App interface, find the command to activate virtual environment
2. Copy it (looks like):
   ```bash
   source /home/cpanelusername/virtualenv/backend/3.8/bin/activate && cd /home/cpanelusername/backend
   ```

3. Open **"Terminal"** in cPanel

4. Paste the activation command and press Enter

5. Install dependencies:
   ```bash
   # Upgrade pip first
   pip install --upgrade pip
   
   # Install all dependencies (this takes 10-30 minutes)
   pip install -r requirements.txt
   ```

   **If TensorFlow fails:**
   ```bash
   # Edit requirements.txt to comment out or remove TensorFlow
   pip install -r requirements.txt
   ```

6. Verify installation:
   ```bash
   pip list | grep Flask
   ```

### Step 5: Initialize Database

Still in Terminal with virtual environment activated:

```bash
# Run database setup
python setup_db.py
```

Expected output:
```
✅ Database connection successful
✅ Database tables created successfully
✅ Admin user created
📋 Demo Login Credentials: admin@edulift.com / admin123
```

### Step 6: Setup API Subdomain (Recommended)

1. Go to **"Subdomains"** in cPanel
2. Create subdomain:
   - Subdomain: `api`
   - Domain: `yourdomain.com`
   - Document Root: `/home/cpanelusername/backend/public`
3. Click **"Create"**

4. Create the public directory:
   ```bash
   # In Terminal
   cd /home/cpanelusername/backend
   mkdir public
   ```

5. Update Python App:
   - Go back to **"Setup Python App"**
   - Click **"Edit"** on your application
   - Application URL: `api.yourdomain.com`
   - Click **"Save"**

### Step 7: Test Backend

1. Click **"Restart"** in Python App interface

2. Open browser and test:
   ```
   https://api.yourdomain.com/api/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "message": "EduLift API is running"
   }
   ```

3. If you get 503 error, check:
   - Error log in cPanel → Errors
   - Verify passenger_wsgi.py exists
   - Verify .env file has correct database credentials

---

## 🎨 PART 4: FRONTEND DEPLOYMENT

### Step 1: Upload Frontend Files

1. In **File Manager**, navigate to `public_html`
2. **Delete default files** (index.html, etc.) or backup them
3. Click **"Upload"**
4. Upload your `frontend.zip`
5. Right-click → **"Extract"**
6. Delete ZIP file

### Step 2: Organize Frontend Files

After extraction, your `public_html` should look like:

```
/home/cpanelusername/public_html/
├── .htaccess          ← Important for routing!
├── _next/             ← All Next.js build files
├── static/            ← Static assets
├── favicon.ico
├── index.html
└── ...other HTML files
```

**If files are in a subfolder:**
```bash
# In Terminal
cd /home/cpanelusername/public_html
mv frontend-folder/* .
rm -rf frontend-folder
```

### Step 3: Verify .htaccess

1. In File Manager, open `.htaccess`
2. Ensure it contains the rewrite rules from the provided file
3. Save if you made changes

### Step 4: Set Permissions

In File Manager:
- Directories: **755**
- Files: **644**

Select all → Right-click → Change Permissions

---

## 🔒 PART 5: SSL & DOMAIN CONFIGURATION

### Step 1: Enable SSL

1. Go to **"SSL/TLS Status"** in cPanel
2. Select your domain and subdomain (api.yourdomain.com)
3. Click **"Run AutoSSL"**
4. Wait for certificates to be issued (2-10 minutes)

### Step 2: Force HTTPS

Already configured in `.htaccess`, but verify:
- Visit `http://yourdomain.com` → should redirect to `https://`

### Step 3: Configure DNS (if domain is external)

If your domain is registered elsewhere:

1. Login to your domain registrar
2. Update nameservers to your hosting provider's NS
3. Or add A records:
   ```
   Type: A
   Name: @
   Value: [Your server IP - get from cPanel]
   
   Type: A
   Name: api
   Value: [Your server IP]
   ```

---

## ✅ PART 6: TESTING & VERIFICATION

### Backend Tests

1. **Health Check:**
   ```
   https://api.yourdomain.com/api/health
   ```
   Should return: `{"status": "healthy"}`

2. **Root Endpoint:**
   ```
   https://api.yourdomain.com/
   ```
   Should show API information

3. **Login Test:**
   ```bash
   curl -X POST https://api.yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin@edulift.com","password":"admin123"}'
   ```
   Should return JWT token

4. **Database Check:**
   - Go to phpMyAdmin in cPanel
   - Select your database
   - Check `users` table has demo accounts

### Frontend Tests

1. **Homepage:**
   ```
   https://yourdomain.com
   ```
   Should load without errors

2. **Login Page:**
   - Navigate to login
   - Try logging in with: `admin@edulift.com` / `admin123`
   - Should successfully login and redirect to dashboard

3. **Browser Console:**
   - Press F12 → Console
   - Should have no CORS errors
   - Should see successful API calls

4. **Dashboard:**
   - After login, check if dashboard loads
   - Verify user profile displays correctly

### Integration Tests

1. **User Registration:**
   - Register a new user
   - Check if user appears in database

2. **Profile Update:**
   - Update profile information
   - Verify changes persist

3. **File Upload:**
   - Try uploading a profile picture
   - Check `/home/cpanelusername/backend/uploads/` folder

---

## 🔧 PART 7: TROUBLESHOOTING

### Backend Issues

**Problem: 503 Service Unavailable**

Solution:
```bash
# Check error log
tail -f ~/logs/[domain]-error_log

# Common fixes:
# 1. Restart Python app in cPanel
# 2. Check passenger_wsgi.py exists and is correct
# 3. Verify .env file has correct values
# 4. Check Python version matches in Setup Python App
```

**Problem: Module not found**

Solution:
```bash
source /home/cpanelusername/virtualenv/backend/3.8/bin/activate
cd /home/cpanelusername/backend
pip install [missing-module]
# Or reinstall all:
pip install -r requirements.txt --force-reinstall
```

**Problem: Database connection failed**

Solution:
```bash
# Test database connection
python -c "import pymysql; pymysql.connect(host='localhost', user='YOUR_USER', password='YOUR_PASS', db='YOUR_DB')"

# Check .env file has correct credentials
cat .env | grep DATABASE_URL
```

### Frontend Issues

**Problem: Blank page or 404**

Solution:
1. Check `.htaccess` exists in public_html
2. Verify all `_next/` files are uploaded
3. Check browser console for errors
4. Verify file permissions (755 for dirs, 644 for files)

**Problem: CORS errors**

Solution:
1. Update backend `app.py`:
   ```python
   CORS(app, resources={r"/api/*": {
       "origins": ["https://yourdomain.com"],
       "supports_credentials": True
   }})
   ```
2. Restart Python app
3. Clear browser cache

**Problem: API calls failing**

Solution:
1. Verify `NEXT_PUBLIC_API_URL` in frontend is correct
2. Check backend is running: `https://api.yourdomain.com/api/health`
3. Check browser console for exact error
4. Verify SSL certificate is valid

---

## 🎯 PART 8: POST-DEPLOYMENT CHECKLIST

### Security

- [ ] Changed default admin password
- [ ] Generated unique SECRET_KEY and JWT_SECRET_KEY
- [ ] Database user has limited privileges (not root)
- [ ] `.env` file is not accessible via web (check .htaccess)
- [ ] SSL certificate is active and valid
- [ ] HTTPS redirect is working
- [ ] Removed or secured demo accounts

### Functionality

- [ ] Backend health endpoint responding
- [ ] Frontend homepage loads
- [ ] Login/logout works
- [ ] User registration works
- [ ] Profile management works
- [ ] Dashboard displays correctly
- [ ] File uploads work (if applicable)
- [ ] All major features tested

### Performance

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Browser caching enabled (.htaccess)
- [ ] Compression enabled (gzip)
- [ ] Database queries optimized

### Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error alerting
- [ ] Database backup scheduled
- [ ] Regular backup testing

---

## 📞 NEED HELP?

### Check Logs

**Backend Errors:**
```bash
# In Terminal
tail -f ~/logs/[yourdomain]-error_log
tail -f ~/logs/api.[yourdomain]-error_log
```

**Application Output:**
```bash
# Check passenger log
tail -f ~/passenger.log
```

### Common Commands

```bash
# Activate Python environment
source /home/cpanelusername/virtualenv/backend/3.8/bin/activate

# Navigate to backend
cd /home/cpanelusername/backend

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Test database connection
python -c "from app import create_app; app = create_app('production'); print('OK')"

# Run database setup again
python setup_db.py

# Check running Python processes
ps aux | grep python
```

### Contact Support

If issues persist:
1. Check cPanel error logs
2. Review Python app logs
3. Contact your hosting provider support
4. Provide specific error messages

---

## 🎉 DEPLOYMENT COMPLETE!

Your EduLift platform should now be live at:
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com

### Next Steps:

1. **Change all default passwords**
2. **Create real user accounts**
3. **Add your content and customize**
4. **Set up regular backups**
5. **Monitor performance and errors**
6. **Collect user feedback**

---

**Congratulations on deploying EduLift! 🎓✨**

*For detailed troubleshooting and optimization, refer to CPANEL_HOSTING_GUIDE.md*
