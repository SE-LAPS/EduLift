# 🎯 EduLift cPanel Deployment - START HERE

**Everything you need to deploy EduLift on cPanel is ready!**

---

## ✅ What's Been Created

I've generated **12 essential deployment files** for you:

### 🔧 Critical Configuration Files (Must Upload)
1. ✅ `backend/passenger_wsgi.py` - cPanel Python entry point
2. ✅ `frontend/.htaccess` - URL routing and security
3. ✅ `backend/.env.production.example` - Backend config template
4. ✅ `frontend/.env.production.example` - Frontend config template

### 📚 Step-by-Step Guides (Choose One)
5. ✅ `QUICK_START_CPANEL.md` - **30-60 minutes** (Recommended for first deployment)
6. ✅ `CPANEL_DEPLOYMENT_INSTRUCTIONS.md` - Detailed step-by-step
7. ✅ `CPANEL_HOSTING_GUIDE.md` - Complete manual with troubleshooting

### 🛠️ Automation Tools
8. ✅ `deploy-prepare.bat` - Windows preparation script
9. ✅ `deploy-prepare.sh` - Linux/Mac preparation script

### 📋 Reference Documents
10. ✅ `DEPLOYMENT_CHECKLIST.md` - Track your progress
11. ✅ `DEPLOYMENT_SUMMARY.md` - Files overview
12. ✅ `README_DEPLOYMENT.md` - This file

### 📝 Updated Files
- ✅ `frontend/next.config.js` - Production-ready
- ✅ `backend/app.py` - CORS configured

---

## 🚀 3 Ways to Deploy

### Option 1: Automated (Easiest) ⭐ Recommended

**Step 1:** Run the preparation script

Windows:
```batch
cd g:\EduLift\EduLift
deploy-prepare.bat
```

Linux/Mac:
```bash
cd /path/to/EduLift
chmod +x deploy-prepare.sh
./deploy-prepare.sh
```

**What it does:**
- ✅ Generates security keys
- ✅ Creates .env files from templates
- ✅ Installs frontend dependencies
- ✅ Builds frontend for production
- ✅ Creates deployment ZIP files

**Step 2:** Follow the Quick Start Guide
```
Open: QUICK_START_CPANEL.md
Time: 30-60 minutes
```

---

### Option 2: Manual Quick Start (Fast)

**For those who prefer step-by-step:**

```
1. Read: QUICK_START_CPANEL.md
2. Follow: 8 simple steps
3. Track: Use DEPLOYMENT_CHECKLIST.md
Time: 30-60 minutes
```

---

### Option 3: Complete Manual (Detailed)

**For complete understanding:**

```
1. Read: CPANEL_HOSTING_GUIDE.md (850+ lines)
2. Follow: CPANEL_DEPLOYMENT_INSTRUCTIONS.md
3. Reference: DEPLOYMENT_SUMMARY.md for file details
Time: 1-2 hours
```

---

## 🎯 Quick Start Right Now (5 Steps)

### Step 1: Generate Keys (2 minutes)

Open Terminal/Command Prompt:

```bash
# Generate SECRET_KEY
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# Generate JWT_SECRET_KEY
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

**📝 SAVE THESE KEYS!** You'll need them in Step 2.

---

### Step 2: Configure Backend (3 minutes)

```bash
cd backend

# Copy template
copy .env.production.example .env   # Windows
# or
cp .env.production.example .env     # Linux/Mac

# Edit .env and update these values:
```

**Update in `.env`:**
```env
SECRET_KEY=paste_your_generated_key_here
JWT_SECRET_KEY=paste_your_generated_jwt_key_here
DATABASE_URL=mysql+pymysql://USER:PASS@localhost:3306/DB_NAME
FRONTEND_URL=https://yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

*(You'll get DATABASE_URL details from cPanel)*

---

### Step 3: Configure Frontend (2 minutes)

```bash
cd ../frontend

# Copy template
copy .env.production.example .env.production   # Windows
# or
cp .env.production.example .env.production     # Linux/Mac

# Edit .env.production
```

**Update in `.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

### Step 4: Build Frontend (5 minutes)

```bash
# Still in frontend directory
npm install
npm run build
```

Wait for build to complete. You should see "✓ Compiled successfully".

---

### Step 5: Follow Deployment Guide

Now choose your guide:

**Quick Start (Recommended):**
```
Open: QUICK_START_CPANEL.md
Follow: Steps 3-8 (database, upload, test)
```

**Or Detailed Instructions:**
```
Open: CPANEL_DEPLOYMENT_INSTRUCTIONS.md
Follow: Parts 2-6
```

---

## 📦 What You'll Upload to cPanel

### Backend Package
**Location:** `backend/` folder  
**Compress as:** `backend.zip`  
**Upload to:** cPanel home directory (`/home/username/`)  
**Must include:**
- ✅ `passenger_wsgi.py` (critical!)
- ✅ `.env` (with your values)
- ✅ `app.py`, `config.py`, `setup_db.py`
- ✅ `requirements.txt`
- ✅ `models/` folder
- ✅ `routes/` folder
- ✅ `uploads/` folder
- ✅ `ml_models/` folder

### Frontend Package
**Location:** `frontend/` folder  
**Compress as:** `frontend.zip`  
**Upload to:** cPanel `public_html/`  
**Must include:**
- ✅ `.next/` folder (entire folder with all files)
- ✅ `public/` folder
- ✅ `.htaccess` (critical!)
- ✅ `package.json`
- ✅ `next.config.js`

---

## 🗄️ Database Setup (You'll Do This in cPanel)

In cPanel MySQL Databases, create:

**Database:**
- Name: `edulift_prod`
- Full name: `cpanelusername_edulift_prod`

**User:**
- Username: `edulift_user`
- Password: Generate strong password
- Privileges: ALL

**Connection String:**
```
mysql+pymysql://cpanelusername_edulift_user:PASSWORD@localhost:3306/cpanelusername_edulift_prod
```

Update this in your `backend/.env` file!

---

## ⚡ After Uploading Files

### Backend Setup (in cPanel)

1. **Setup Python App:**
   - Python Version: 3.8+
   - Application Root: `backend`
   - Startup File: `passenger_wsgi.py`
   - Entry Point: `application`

2. **Install Dependencies:**
   ```bash
   source /home/username/virtualenv/backend/3.8/bin/activate
   cd /home/username/backend
   pip install -r requirements.txt
   ```

3. **Initialize Database:**
   ```bash
   python setup_db.py
   ```

4. **Create API Subdomain:**
   - Subdomain: `api`
   - Document Root: `/home/username/backend/public`
   - Update Python App URL to: `api.yourdomain.com`

### Frontend Setup (in cPanel)

1. **Extract files to `public_html/`**
2. **Verify `.htaccess` is present**
3. **Set permissions:**
   - Directories: 755
   - Files: 644

---

## ✅ Testing Your Deployment

### Backend Test
Visit: `https://api.yourdomain.com/api/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "message": "EduLift API is running"
}
```

### Frontend Test
Visit: `https://yourdomain.com`

**Expected:** Homepage loads without errors

### Login Test
1. Go to login page
2. Use: `admin@edulift.com` / `admin123`
3. Should redirect to dashboard

---

## 🆘 Troubleshooting

### Backend 503 Error
```bash
# Check error logs in cPanel → Errors
# Or via Terminal:
tail -f ~/logs/api.yourdomain.com-error_log

# Common fix: Restart Python app in "Setup Python App"
```

### Frontend Blank Page
1. Check browser console (F12)
2. Verify `.htaccess` exists in `public_html/`
3. Check file permissions (755/644)
4. Clear browser cache

### CORS Errors in Browser Console
1. Verify `FRONTEND_URL` in backend `.env`
2. Restart Python app in cPanel
3. Clear browser cache

### Database Connection Failed
```bash
# Test connection
python -c "import pymysql; pymysql.connect(host='localhost', user='YOUR_USER', password='YOUR_PASS', db='YOUR_DB')"

# Verify .env has correct DATABASE_URL
cat .env | grep DATABASE_URL
```

---

## 🔐 Security Reminders

After deployment:

- [ ] Change admin password from `admin123`
- [ ] Verify `.env` not accessible: `https://yourdomain.com/.env` → Should be 403
- [ ] Enable HTTPS (AutoSSL in cPanel)
- [ ] Remove or secure demo accounts
- [ ] Setup regular backups

---

## 📞 Need More Help?

### Documentation
- **Quick (30-60 min):** `QUICK_START_CPANEL.md`
- **Detailed:** `CPANEL_DEPLOYMENT_INSTRUCTIONS.md`
- **Complete:** `CPANEL_HOSTING_GUIDE.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`

### Common Commands
```bash
# Activate Python environment
source /home/username/virtualenv/backend/3.8/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check logs
tail -f ~/logs/error.log

# Test database
python -c "from app import create_app; app = create_app('production'); print('OK')"
```

---

## 🎉 You're All Set!

**Everything is ready for deployment!**

### Next Step: Choose Your Path

1. **Fastest:** Run `deploy-prepare.bat` (or `.sh`) → Follow `QUICK_START_CPANEL.md`
2. **Detailed:** Follow `CPANEL_DEPLOYMENT_INSTRUCTIONS.md`
3. **Complete:** Read `CPANEL_HOSTING_GUIDE.md`

### Timeline

- **Preparation:** 15 minutes
- **Database Setup:** 5 minutes
- **Backend Deployment:** 20 minutes
- **Frontend Deployment:** 10 minutes
- **Testing:** 10 minutes
- **Total:** 60-90 minutes

---

## 📊 File Structure Reference

```
EduLift/
├── backend/
│   ├── passenger_wsgi.py         ⭐ NEW - cPanel entry point
│   ├── .env.production.example   ⭐ NEW - Config template
│   ├── .env                       → Create from example
│   ├── app.py                     ✏️ Updated - CORS config
│   └── ...
│
├── frontend/
│   ├── .htaccess                  ⭐ NEW - URL routing
│   ├── .env.production.example   ⭐ NEW - Config template
│   ├── .env.production            → Create from example
│   ├── next.config.js             ✏️ Updated - Production ready
│   └── ...
│
├── QUICK_START_CPANEL.md          ⭐ NEW - Quick guide
├── CPANEL_DEPLOYMENT_INSTRUCTIONS.md  ⭐ NEW - Step-by-step
├── CPANEL_HOSTING_GUIDE.md        ⭐ NEW - Complete manual
├── DEPLOYMENT_CHECKLIST.md        ⭐ NEW - Progress tracker
├── DEPLOYMENT_SUMMARY.md          ⭐ NEW - Files overview
├── README_DEPLOYMENT.md           ⭐ NEW - This file
├── deploy-prepare.bat             ⭐ NEW - Windows script
└── deploy-prepare.sh              ⭐ NEW - Linux/Mac script
```

---

**🚀 Ready to deploy! Choose your guide and start now!**

**Your EduLift platform will be live in about an hour! 🎓✨**

---

*For additional questions or customization needs, refer to the comprehensive guides.*
