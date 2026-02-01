# ✅ EduLift cPanel Deployment Checklist

Use this checklist to track your deployment progress.

---

## 📦 PRE-DEPLOYMENT (Local Preparation)

### Files Created
- [ ] `backend/passenger_wsgi.py` exists
- [ ] `backend/.env` configured with production values
- [ ] `frontend/.env.production` configured
- [ ] `frontend/.htaccess` created

### Security Keys Generated
- [ ] Generated SECRET_KEY
- [ ] Generated JWT_SECRET_KEY
- [ ] Created strong admin password
- [ ] Keys added to backend/.env file

### Backend Configuration
- [ ] Updated DATABASE_URL format (ready for cPanel values)
- [ ] Set FLASK_ENV=production
- [ ] Set correct FRONTEND_URL
- [ ] Verified requirements.txt includes all dependencies

### Frontend Build
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run build` successfully
- [ ] Verified `.next` folder created
- [ ] No build errors

### Deployment Packages
- [ ] Created backend.zip with all backend files
- [ ] Created frontend.zip with .next, public, .htaccess
- [ ] Verified .env files are included

---

## 🗄️ DATABASE SETUP

### MySQL Database
- [ ] Logged into cPanel
- [ ] Created database: `edulift_prod`
- [ ] Noted full database name (with prefix)
- [ ] Created database user: `edulift_user`
- [ ] Generated and saved strong password
- [ ] Added user to database
- [ ] Granted ALL PRIVILEGES

### Database Credentials Saved
```
Host: localhost
Name: ______________________
User: ______________________
Pass: ______________________
Port: 3306
```

### Backend Configuration Updated
- [ ] Updated DATABASE_URL in backend/.env
- [ ] Re-zipped backend with updated .env

---

## 🐍 BACKEND DEPLOYMENT

### File Upload
- [ ] Uploaded backend.zip to home directory
- [ ] Extracted backend.zip
- [ ] Verified passenger_wsgi.py exists
- [ ] Verified .env file exists and has correct values
- [ ] Deleted .zip file

### Python Application Setup
- [ ] Opened "Setup Python App" in cPanel
- [ ] Created new Python application
- [ ] Set Python version (3.8+)
- [ ] Set Application Root: `backend`
- [ ] Set Startup File: `passenger_wsgi.py`
- [ ] Set Entry Point: `application`
- [ ] Virtual environment created successfully

### Dependencies Installation
- [ ] Opened Terminal in cPanel
- [ ] Activated virtual environment
- [ ] Upgraded pip
- [ ] Ran `pip install -r requirements.txt`
- [ ] All dependencies installed (or TensorFlow skipped)
- [ ] Verified Flask installed: `pip list | grep Flask`

### Database Initialization
- [ ] Ran `python setup_db.py`
- [ ] Tables created successfully
- [ ] Demo users created
- [ ] No errors in output

### API Subdomain (Optional but Recommended)
- [ ] Created subdomain: `api.yourdomain.com`
- [ ] Created `backend/public` directory
- [ ] Updated Python App URL to subdomain
- [ ] Restarted Python application

### Backend Testing
- [ ] Health check works: `/api/health`
- [ ] Root endpoint shows API info
- [ ] No 503 errors
- [ ] Checked error logs (no critical errors)

---

## 🎨 FRONTEND DEPLOYMENT

### File Upload
- [ ] Navigated to `public_html` in File Manager
- [ ] Backed up or deleted default files
- [ ] Uploaded frontend.zip
- [ ] Extracted frontend.zip
- [ ] Verified .htaccess exists in public_html
- [ ] Verified _next folder exists
- [ ] Deleted .zip file

### File Organization
- [ ] All files in correct location (not in subfolder)
- [ ] .htaccess in public_html root
- [ ] _next folder accessible
- [ ] public/static files accessible

### Permissions
- [ ] Set directories to 755
- [ ] Set files to 644
- [ ] Verified .htaccess permissions correct

### Frontend Testing
- [ ] Homepage loads: `https://yourdomain.com`
- [ ] No 404 errors
- [ ] Static assets loading (images, CSS, JS)
- [ ] No blank page

---

## 🔒 SSL & DOMAIN CONFIGURATION

### SSL Certificate
- [ ] Ran AutoSSL in cPanel
- [ ] SSL active for main domain
- [ ] SSL active for api subdomain
- [ ] HTTPS redirect working
- [ ] No mixed content warnings

### DNS Configuration (if needed)
- [ ] Nameservers updated (if external domain)
- [ ] A records configured
- [ ] DNS propagation complete
- [ ] www and non-www both work

---

## ✅ TESTING & VERIFICATION

### Backend Tests
- [ ] `/api/health` returns 200 OK
- [ ] `/api/auth/login` accepts credentials
- [ ] JWT token generated successfully
- [ ] Database tables exist in phpMyAdmin
- [ ] Demo users exist in database

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] Login page accessible
- [ ] Login works with demo credentials
- [ ] Dashboard loads after login
- [ ] User profile displays correctly
- [ ] Browser console has no CORS errors

### Integration Tests
- [ ] User can register new account
- [ ] New user appears in database
- [ ] Profile update works
- [ ] File upload works (if applicable)
- [ ] Logout works
- [ ] Session persistence works

### Cross-Browser Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Tested in Edge
- [ ] Mobile responsive

---

## 🔐 SECURITY POST-DEPLOYMENT

### Passwords & Keys
- [ ] Changed admin password from default
- [ ] Verified .env not accessible via browser
- [ ] Tested: `https://yourdomain.com/.env` returns 403
- [ ] Unique SECRET_KEY in production
- [ ] Unique JWT_SECRET_KEY in production

### Access Control
- [ ] Demo accounts secured or removed
- [ ] Database user has minimal privileges
- [ ] File permissions correct (not 777)
- [ ] Error messages don't expose sensitive info

### SSL/TLS
- [ ] Certificate valid and trusted
- [ ] HTTPS redirect working on all pages
- [ ] HSTS header enabled
- [ ] No mixed content warnings

---

## 📊 PERFORMANCE & MONITORING

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured

### Monitoring Setup
- [ ] Uptime monitoring configured (UptimeRobot, etc.)
- [ ] Error log monitoring set up
- [ ] Backup schedule created
- [ ] Tested backup restoration

### Database Optimization
- [ ] Indexes created on common queries
- [ ] Connection pooling configured
- [ ] Regular maintenance scheduled

---

## 📝 DOCUMENTATION

### Credentials Documented
- [ ] cPanel login saved securely
- [ ] Database credentials saved
- [ ] Admin account credentials saved
- [ ] SSH/FTP credentials saved (if applicable)

### Deployment Notes
- [ ] Server/hosting details documented
- [ ] Deployment date recorded
- [ ] Python version noted
- [ ] Node.js version noted
- [ ] Any custom configurations documented

---

## 🎯 FINAL VERIFICATION

### Complete System Test
- [ ] Performed end-to-end user journey
- [ ] All core features working
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place

### Handoff Preparation
- [ ] Documentation complete
- [ ] Access credentials organized
- [ ] Known issues documented
- [ ] Support contacts saved

---

## 🎉 DEPLOYMENT STATUS

**Deployment Date:** _______________

**Deployed By:** _______________

**Status:** 
- [ ] ✅ COMPLETE - All systems operational
- [ ] ⚠️ PARTIAL - Some features pending
- [ ] ❌ INCOMPLETE - Issues remain

**Notes:**
```
[Add any important notes, issues, or customizations here]





```

---

## 📞 QUICK REFERENCE

### URLs
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- cPanel: https://yourdomain.com:2083
- phpMyAdmin: https://yourdomain.com:2083/phpmyadmin

### Demo Accounts (CHANGE IMMEDIATELY)
- Admin: admin@edulift.com / admin123
- Teacher: teacher@edulift.com / teacher123
- Student: student@edulift.com / student123

### Important Paths
- Backend: `/home/cpanelusername/backend/`
- Frontend: `/home/cpanelusername/public_html/`
- Uploads: `/home/cpanelusername/backend/uploads/`
- Logs: `/home/cpanelusername/logs/`

### Support Commands
```bash
# Activate Python environment
source /home/cpanelusername/virtualenv/backend/3.8/bin/activate

# View error logs
tail -f ~/logs/[domain]-error_log

# Restart Python app
# (Use "Restart" button in Setup Python App)

# Check database connection
python -c "import pymysql; print('DB OK')"
```

---

**Keep this checklist for future reference and maintenance!**
