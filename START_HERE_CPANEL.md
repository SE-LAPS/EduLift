# 🎯 Deploy EduLift to edulift.techxdoz.com - START HERE

## 📌 Your Deployment Goal

Deploy EduLift to your cPanel hosting at **techxdoz.com** as a subdomain:
- **Frontend:** https://edulift.techxdoz.com
- **Backend API:** https://api.edulift.techxdoz.com

---

## ✨ Choose Your Guide (Pick ONE)

### 🚀 **Option 1: SIMPLE GUIDE** ⭐ **RECOMMENDED**
**File:** [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)

**Best for:**
- Quick deployment (60-90 minutes)
- First-time cPanel users
- Step-by-step instructions
- All-in-one guide

**What you get:**
- 7 clear sections
- Copy-paste commands
- Specific to edulift.techxdoz.com
- Troubleshooting included

👉 **Start here if you want the fastest path to deployment**

---

### ⚡ **Option 2: QUICK REFERENCE CARD**
**File:** [CPANEL_QUICK_REFERENCE.md](CPANEL_QUICK_REFERENCE.md)

**Best for:**
- Experienced users
- Quick lookup
- One-page overview
- Commands reference

**What you get:**
- Single-page cheat sheet
- All commands in one place
- Quick troubleshooting table
- File locations reference

👉 **Use this if you've deployed before and just need a reminder**

---

### 📖 **Option 3: DETAILED GUIDES** (For Advanced Users)

If you need extensive details, use these:

1. **[CPANEL_DEPLOYMENT_INSTRUCTIONS.md](CPANEL_DEPLOYMENT_INSTRUCTIONS.md)** (600+ lines)
   - Extremely detailed step-by-step
   - Every command explained
   - Complete troubleshooting section

2. **[CPANEL_HOSTING_GUIDE.md](CPANEL_HOSTING_GUIDE.md)** (1200+ lines)
   - Comprehensive manual
   - Architecture details
   - Performance optimization
   - Security best practices

3. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)**
   - Overview of all files
   - Multiple deployment options
   - Deployment checklist

👉 **Use these for deep understanding or complex setups**

---

## 🎯 Recommended Workflow

### For Most Users (Fastest):

1. **Read:** [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)
2. **Follow:** All 7 parts in order
3. **Reference:** [CPANEL_QUICK_REFERENCE.md](CPANEL_QUICK_REFERENCE.md) for quick lookups
4. **Time:** 60-90 minutes total

### For Experienced Users:

1. **Use:** [CPANEL_QUICK_REFERENCE.md](CPANEL_QUICK_REFERENCE.md) as your main guide
2. **Refer to:** [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md) if you need more details
3. **Time:** 45-60 minutes

---

## 📋 What You Need Before Starting

✅ **cPanel Access**
- Login: https://techxdoz.com:2083
- Username and password

✅ **Server Requirements**
- Python 3.8+ support
- MySQL database
- 2GB+ storage
- SSL certificate support

✅ **Local Requirements**
- Python 3.8+ installed
- Node.js 16+ installed
- Terminal/Command Prompt

---

## 🚦 Quick Start (5 Steps)

1. **Open:** [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)

2. **Generate Keys Locally:**
   ```bash
   python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
   python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
   ```

3. **Configure Files:**
   - Backend: `backend/.env`
   - Frontend: `frontend/.env.production`

4. **Build & ZIP:**
   ```bash
   cd frontend
   npm install && npm run build
   ```
   - Create backend.zip
   - Create frontend.zip

5. **Follow the simple guide for cPanel steps**

---

## 🎯 Your Target URLs

After deployment, your site will be at:

- **Main Site:** https://edulift.techxdoz.com
- **API:** https://api.edulift.techxdoz.com/api
- **Health Check:** https://api.edulift.techxdoz.com/api/health
- **Admin Login:** admin@edulift.com / [your password]

---

## 🆘 If You Get Stuck

1. **Check:** Troubleshooting section in [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md)
2. **Quick Fixes:** See [CPANEL_QUICK_REFERENCE.md](CPANEL_QUICK_REFERENCE.md) - "Quick Fixes" section
3. **Detailed Help:** Consult [CPANEL_HOSTING_GUIDE.md](CPANEL_HOSTING_GUIDE.md) - Troubleshooting chapter

---

## 📊 File Structure Overview

All deployment files are ready in your project:

```
EduLift/
│
├── START_HERE_CPANEL.md           ← You are here
├── SIMPLE_CPANEL_DEPLOYMENT.md    ← ⭐ Main guide (recommended)
├── CPANEL_QUICK_REFERENCE.md      ← ⚡ Quick cheat sheet
├── CPANEL_DEPLOYMENT_INSTRUCTIONS.md
├── CPANEL_HOSTING_GUIDE.md
├── DEPLOYMENT_SUMMARY.md
│
├── backend/
│   ├── .env.production.example    ← Copy to .env
│   ├── passenger_wsgi.py          ← Already configured
│   └── requirements.txt
│
└── frontend/
    ├── .env.production.example    ← Copy to .env.production
    ├── .htaccess                  ← Critical for routing
    └── next.config.js
```

---

## ✅ Success Checklist

Your deployment is complete when:

- [ ] Backend health check: https://api.edulift.techxdoz.com/api/health returns `{"status": "healthy"}`
- [ ] Frontend loads: https://edulift.techxdoz.com shows the homepage
- [ ] Login works with admin credentials
- [ ] No CORS errors in browser console (F12)
- [ ] HTTPS is working (padlock icon in browser)
- [ ] Database has user records

---

## 🎓 Next Steps After Deployment

1. **Security:** Change default admin password
2. **Testing:** Test all major features
3. **Backups:** Set up database backups in cPanel
4. **Monitoring:** Enable uptime monitoring
5. **Content:** Add your educational content

---

## 💡 Pro Tips

- **Save Time:** Use the simple guide, not the complex ones
- **Keep Credentials Safe:** Store your database password securely
- **Test Locally First:** Ensure everything works before deploying
- **Use SSL:** Always enable HTTPS for security
- **Regular Backups:** Schedule weekly database backups

---

## 🎉 Ready to Deploy?

👉 **Open [SIMPLE_CPANEL_DEPLOYMENT.md](SIMPLE_CPANEL_DEPLOYMENT.md) and start deploying!**

**Estimated Time:** 60-90 minutes from start to finish

**Good luck! You've got this! 🚀**

---

*All guides have been optimized specifically for deploying to edulift.techxdoz.com on cPanel.*
