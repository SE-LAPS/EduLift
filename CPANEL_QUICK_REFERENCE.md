# ⚡ EduLift cPanel - Quick Reference Card

## Deploy to: edulift.techxdoz.com

---

## 🎯 Step-by-Step (60 minutes)

### LOCAL SETUP (15 min)

1. **Generate Keys**
   ```bash
   python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
   python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
   ```

2. **Backend .env** (g:\EduLift\EduLift\backend\.env)
   ```env
   SECRET_KEY=[your_key]
   JWT_SECRET_KEY=[your_key]
   DATABASE_URL=mysql+pymysql://USER:PASS@localhost:3306/DB
   FRONTEND_URL=https://edulift.techxdoz.com
   ```

3. **Frontend .env.production** (g:\EduLift\EduLift\frontend\.env.production)
   ```env
   NEXT_PUBLIC_API_URL=https://api.edulift.techxdoz.com/api
   NEXT_PUBLIC_SITE_URL=https://edulift.techxdoz.com
   ```

4. **Build**
   ```bash
   cd frontend
   npm install && npm run build
   ```

5. **ZIP Files**
   - backend.zip (entire backend folder)
   - frontend.zip (.next, public, .htaccess, package.json, next.config.js)

---

### CPANEL DATABASE (5 min)

**MySQL® Databases:**
1. Create DB: `edulift_prod` → Note: `techxdoz_edulift_prod`
2. Create User: `edulift_user` + strong password
3. Add user to DB → ALL PRIVILEGES
4. Update backend/.env DATABASE_URL → Re-zip backend

---

### CPANEL SUBDOMAINS (2 min)

**Subdomains:**
1. `edulift.techxdoz.com` → `public_html/edulift`
2. `api.edulift.techxdoz.com` → `/home/USERNAME/backend/public`

---

### BACKEND DEPLOY (20 min)

**File Manager:**
1. Upload backend.zip to home directory → Extract → Delete zip

**Setup Python App:**
```
Python: 3.8+
Root: backend
URL: api.edulift.techxdoz.com
Startup: passenger_wsgi.py
Entry: application
```

**Terminal:**
```bash
source /home/USERNAME/virtualenv/backend/3.8/bin/activate
cd /home/USERNAME/backend
pip install --upgrade pip
pip install -r requirements.txt
mkdir public
python setup_db.py
```

**Test:** https://api.edulift.techxdoz.com/api/health

---

### FRONTEND DEPLOY (10 min)

**File Manager:**
1. Navigate to `public_html/edulift`
2. Upload frontend.zip → Extract → Delete zip
3. Move files to edulift root if in subfolder

**Permissions:**
- Directories: 755
- Files: 644

---

### SSL (5 min)

**SSL/TLS Status:**
- Select: edulift.techxdoz.com + api.edulift.techxdoz.com
- Run AutoSSL → Wait 5 min

---

### TEST (5 min)

✅ https://api.edulift.techxdoz.com/api/health → {"status": "healthy"}
✅ https://edulift.techxdoz.com → Loads
✅ Login: admin@edulift.com / admin123
✅ No CORS errors (F12)

---

## 🆘 Quick Fixes

| Issue | Fix |
|-------|-----|
| 503 Error | Setup Python App → Restart |
| Blank Page | Check .htaccess in public_html/edulift |
| CORS | Update FRONTEND_URL in backend/.env → Restart |
| DB Error | Verify DATABASE_URL matches cPanel |

---

## 📁 File Locations

```
/home/USERNAME/
├── backend/
│   ├── .env ← Database credentials
│   ├── passenger_wsgi.py ← Entry point
│   └── public/ ← Create this
│
└── public_html/edulift/
    ├── .htaccess ← Critical
    └── _next/ ← Build files
```

---

## 🔑 Critical Files

- **passenger_wsgi.py** - Backend entry point
- **.htaccess** - Frontend routing
- **.env** - Backend config (with DB credentials)
- **.env.production** - Frontend config

---

## 📞 Need Help?

Full guide: **SIMPLE_CPANEL_DEPLOYMENT.md**

---

**Done! 🎉 Your site is live!**
