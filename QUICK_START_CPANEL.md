# 🚀 Quick Start: Deploy EduLift to cPanel

**Total Time: 30-60 minutes**

---

## 🎯 Overview

This quick start guide gets your EduLift platform live on cPanel in 8 simple steps.

---

## ✅ Step 1: Generate Security Keys (2 minutes)

Open Terminal/Command Prompt:

```bash
# Generate SECRET_KEY
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# Generate JWT_SECRET_KEY
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

**📝 Save both keys** - you'll need them soon!

---

## ✅ Step 2: Prepare Files (5 minutes)

### Backend Setup

```bash
cd g:\EduLift\EduLift\backend

# Copy environment template
copy .env.production.example .env

# Edit .env file - update these values:
# - SECRET_KEY (from Step 1)
# - JWT_SECRET_KEY (from Step 1)
# - DATABASE_URL (you'll get this from cPanel in Step 3)
# - FRONTEND_URL=https://yourdomain.com
# - ADMIN_PASSWORD=your_secure_password
```

### Frontend Setup

```bash
cd g:\EduLift\EduLift\frontend

# Copy environment template
copy .env.production.example .env.production

# Edit .env.production - update these values:
# - NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
# - NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Build frontend
npm install
npm run build
```

---

## ✅ Step 3: Setup Database (5 minutes)

1. **Login to cPanel**: `https://yourdomain.com:2083`

2. **Create Database**:
   - Open "MySQL® Databases"
   - Create database: `edulift_prod`
   - Note full name: `cpanel_username_edulift_prod`

3. **Create User**:
   - Username: `edulift_user`
   - Password: Use "Password Generator" (save it!)

4. **Grant Privileges**:
   - Add user to database
   - Check "ALL PRIVILEGES"

5. **Update Backend .env**:
   ```env
   DATABASE_URL=mysql+pymysql://cpanel_username_edulift_user:YOUR_PASSWORD@localhost:3306/cpanel_username_edulift_prod
   ```

---

## ✅ Step 4: Upload Backend (10 minutes)

1. **Compress Backend**:
   - Zip entire `backend` folder
   - Include: app.py, passenger_wsgi.py, .env, requirements.txt, models/, routes/

2. **Upload to cPanel**:
   - File Manager → Home Directory
   - Upload `backend.zip`
   - Extract it

3. **Setup Python App**:
   - Open "Setup Python App"
   - Click "Create Application"
   - Python Version: 3.8+
   - Application Root: `backend`
   - Startup File: `passenger_wsgi.py`
   - Entry Point: `application`
   - Click "Create"

4. **Install Dependencies**:
   ```bash
   # Open Terminal in cPanel
   source /home/cpanelusername/virtualenv/backend/3.8/bin/activate
   cd /home/cpanelusername/backend
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
   *This takes 10-30 minutes*

5. **Initialize Database**:
   ```bash
   python setup_db.py
   ```

6. **Create API Subdomain**:
   - Go to "Subdomains"
   - Subdomain: `api`
   - Document Root: `/home/cpanelusername/backend/public`
   - Create `public` directory: `mkdir /home/cpanelusername/backend/public`

7. **Update Python App**:
   - Edit application
   - Application URL: `api.yourdomain.com`
   - Save and Restart

---

## ✅ Step 5: Upload Frontend (5 minutes)

1. **Compress Frontend Files**:
   - Create zip with:
     - `.next/` folder (all contents)
     - `public/` folder
     - `.htaccess` file
     - `package.json`
     - `next.config.js`

2. **Upload to cPanel**:
   - File Manager → `public_html`
   - Delete default files (or backup)
   - Upload `frontend.zip`
   - Extract it
   - Move all files to root if in subfolder

3. **Set Permissions**:
   - Select all files
   - Change Permissions
   - Directories: 755
   - Files: 644

---

## ✅ Step 6: Enable SSL (5 minutes)

1. Go to "SSL/TLS Status" in cPanel
2. Select your domains:
   - `yourdomain.com`
   - `api.yourdomain.com`
3. Click "Run AutoSSL"
4. Wait for certificates (2-10 minutes)

---

## ✅ Step 7: Test Everything (5 minutes)

### Backend Test
```
https://api.yourdomain.com/api/health
```
**Expected**: `{"status": "healthy", "message": "EduLift API is running"}`

### Frontend Test
```
https://yourdomain.com
```
**Expected**: Homepage loads

### Login Test
- Navigate to login page
- Use: `admin@edulift.com` / `admin123`
- Should redirect to dashboard

---

## ✅ Step 8: Secure Your Deployment (5 minutes)

1. **Change Admin Password**:
   - Login with default credentials
   - Go to profile settings
   - Change password

2. **Verify Security**:
   - Try accessing: `https://yourdomain.com/.env` (should get 403 Forbidden)
   - Check HTTPS redirect works
   - Test browser console (no errors)

3. **Setup Monitoring**:
   - Create account at uptimerobot.com
   - Add monitor for your domain
   - Add monitor for API endpoint

---

## 🎉 You're Live!

Your EduLift platform is now accessible at:
- **Frontend**: https://yourdomain.com
- **Backend**: https://api.yourdomain.com

---

## 🆘 Quick Troubleshooting

### Backend 503 Error
```bash
# Check logs
tail -f ~/logs/api.yourdomain.com-error_log

# Restart app in "Setup Python App"
```

### Frontend Blank Page
1. Check browser console (F12)
2. Verify .htaccess is in public_html
3. Check file permissions

### CORS Errors
Update backend `app.py`:
```python
CORS(app, resources={r"/api/*": {
    "origins": ["https://yourdomain.com"],
    "supports_credentials": True
}})
```
Then restart Python app.

### Database Connection Failed
```bash
# Test connection
python -c "import pymysql; pymysql.connect(host='localhost', user='YOUR_USER', password='YOUR_PASS', db='YOUR_DB')"

# Check .env file
cat .env | grep DATABASE_URL
```

---

## 📚 More Help

- **Detailed Guide**: `CPANEL_DEPLOYMENT_INSTRUCTIONS.md`
- **Full Manual**: `CPANEL_HOSTING_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## 🎯 Next Steps

1. ✅ Change all default passwords
2. ✅ Remove or secure demo accounts
3. ✅ Add your content
4. ✅ Configure email notifications
5. ✅ Setup regular backups
6. ✅ Invite real users

---

**Congratulations! Your EduLift platform is live! 🎓✨**
