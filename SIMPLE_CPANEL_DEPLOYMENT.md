# 🚀 EduLift - Simple cPanel Deployment Guide
## Deploy to edulift.techxdoz.com

**Total Time: 60-90 minutes** | **Difficulty: Easy**

---

## 📋 Prerequisites

- cPanel access to **techxdoz.com**
- Python 3.8+ support in cPanel
- MySQL database available
- 2GB+ storage space

---

## Part 1: Local Preparation (10 minutes)

### 1. Generate Security Keys

Open terminal and run:
```bash
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```
**Save these keys!** You'll need them next.

### 2. Configure Backend

Navigate to backend folder:
```bash
cd g:\EduLift\EduLift\backend
copy .env.production.example .env
```

Edit `.env` file with:
```env
FLASK_ENV=production
SECRET_KEY=[paste your SECRET_KEY]
JWT_SECRET_KEY=[paste your JWT_SECRET_KEY]
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost:3306/DBNAME
FRONTEND_URL=https://edulift.techxdoz.com
ADMIN_PASSWORD=YourSecurePassword123
```
*(We'll update DATABASE_URL after creating the database)*

### 3. Configure Frontend

Navigate to frontend folder:
```bash
cd g:\EduLift\EduLift\frontend
copy .env.production.example .env.production
```

Edit `.env.production` with:
```env
NEXT_PUBLIC_API_URL=https://api.edulift.techxdoz.com/api
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SITE_URL=https://edulift.techxdoz.com
```

### 4. Build Frontend

```bash
npm install
npm run build
```

### 5. Create ZIP Files

**Backend ZIP:** Compress the entire `backend` folder
**Frontend ZIP:** Compress these from `frontend` folder:
- `.next/` folder
- `public/` folder  
- `.htaccess` file
- `package.json`
- `next.config.js`

---

## Part 2: cPanel Database Setup (5 minutes)

### 1. Login to cPanel
- Go to: `https://techxdoz.com:2083`

### 2. Create Database
- Find **"MySQL® Databases"**
- Create database: `edulift_prod`
- Note the full name: `techxdoz_edulift_prod` (or similar with your username prefix)

### 3. Create Database User
- Username: `edulift_user`
- Click "Password Generator" for a strong password
- **SAVE THIS PASSWORD!**

### 4. Link User to Database
- Add user `edulift_user` to database `edulift_prod`
- Grant **ALL PRIVILEGES**

### 5. Update Backend .env
Update your local `backend/.env` with the actual database details:
```env
DATABASE_URL=mysql+pymysql://techxdoz_edulift_user:YOUR_DB_PASSWORD@localhost:3306/techxdoz_edulift_prod
```

**Re-zip the backend folder** with updated .env!

---

## Part 3: Create Subdomain (2 minutes)

### 1. In cPanel, go to **"Subdomains"**

### 2. Create Subdomain
- Subdomain: `edulift`
- Domain: `techxdoz.com`
- Document Root: `public_html/edulift` (cPanel auto-fills this)
- Click **"Create"**

### 3. Create API Subdomain
- Subdomain: `api.edulift`
- Domain: `techxdoz.com`
- Document Root: `/home/YOUR_USERNAME/backend/public`
- Click **"Create"**

---

## Part 4: Deploy Backend (20 minutes)

### 1. Upload Backend

- Open **"File Manager"** in cPanel
- Navigate to your **home directory** (not public_html)
- Upload `backend.zip`
- Right-click → **Extract**
- Delete the ZIP file

### 2. Verify Structure
Check that `/home/YOUR_USERNAME/backend/` contains:
- `app.py`
- `passenger_wsgi.py`
- `.env` (with correct database credentials)
- `requirements.txt`

### 3. Setup Python App

- Find **"Setup Python App"** in cPanel
- Click **"Create Application"**

Configure:
```
Python Version: 3.8 or higher
Application Root: backend
Application URL: api.edulift.techxdoz.com
Application Startup File: passenger_wsgi.py
Application Entry Point: application
```

- Click **"Create"** and wait 2-5 minutes

### 4. Install Dependencies

- In cPanel, open **"Terminal"**
- Copy the activation command from Setup Python App (looks like):
  ```bash
  source /home/YOUR_USERNAME/virtualenv/backend/3.8/bin/activate && cd /home/YOUR_USERNAME/backend
  ```
- Paste in terminal and run
- Then run:
  ```bash
  pip install --upgrade pip
  pip install -r requirements.txt
  ```
  *(This takes 10-30 minutes. If TensorFlow fails, edit requirements.txt to remove it and retry)*

### 5. Create Public Directory & Initialize Database

```bash
cd /home/YOUR_USERNAME/backend
mkdir public
python setup_db.py
```

Expected output: ✅ Database tables created, Admin user created

### 6. Update Python App URL

- Go back to **"Setup Python App"**
- Click **"Edit"** on your app
- Application URL: `api.edulift.techxdoz.com`
- Click **"Save"**
- Click **"Restart"**

### 7. Test Backend

Visit: `https://api.edulift.techxdoz.com/api/health`

Expected response:
```json
{"status": "healthy", "message": "EduLift API is running"}
```

---

## Part 5: Deploy Frontend (10 minutes)

### 1. Upload Frontend

- In **File Manager**, navigate to `public_html/edulift/`
- Delete any default files
- Upload `frontend.zip`
- Right-click → **Extract**
- Delete ZIP file

### 2. Organize Files

Ensure `public_html/edulift/` contains:
```
.htaccess
_next/
public/ (or contents directly in folder)
favicon.ico
(other static files)
```

If files are in a subfolder, move them to `edulift/` root.

### 3. Set Permissions

- Select all files in File Manager
- Right-click → **Change Permissions**
- Directories: **755**
- Files: **644**

---

## Part 6: Enable SSL (5 minutes)

### 1. In cPanel, go to **"SSL/TLS Status"**

### 2. Select Both Subdomains
- ✅ edulift.techxdoz.com
- ✅ api.edulift.techxdoz.com

### 3. Click **"Run AutoSSL"**
Wait 2-10 minutes for certificates

---

## Part 7: Test Everything (10 minutes)

### Backend Tests

1. **Health Check:**
   ```
   https://api.edulift.techxdoz.com/api/health
   ```
   Should return: `{"status": "healthy"}`

2. **Database Check:**
   - Go to **phpMyAdmin** in cPanel
   - Select your database
   - Verify `users` table exists with admin user

### Frontend Tests

1. **Homepage:**
   ```
   https://edulift.techxdoz.com
   ```
   Should load without errors

2. **Login:**
   - Navigate to login page
   - Use: `admin@edulift.com` / `admin123` (or your ADMIN_PASSWORD)
   - Should successfully login

3. **Browser Console:**
   - Press F12 → Console
   - No CORS errors
   - API calls successful

---

## 🎯 Quick Troubleshooting

### Backend: 503 Error
- Go to **Setup Python App** → Click **"Restart"**
- Check `/home/YOUR_USERNAME/logs/` for errors
- Verify `passenger_wsgi.py` exists

### Frontend: Blank Page
- Check `.htaccess` exists in `public_html/edulift/`
- Verify `_next/` folder uploaded correctly
- Check browser console (F12) for errors

### CORS Errors
- Update `backend/.env`: `FRONTEND_URL=https://edulift.techxdoz.com`
- Restart Python app in cPanel

### Database Connection Failed
- Verify `DATABASE_URL` in `backend/.env` matches cPanel credentials
- Check database user has privileges

---

## ✅ Final Checklist

- [ ] Backend health endpoint working
- [ ] Frontend loads at edulift.techxdoz.com
- [ ] Login works
- [ ] HTTPS redirect active
- [ ] SSL certificates valid
- [ ] Changed admin password
- [ ] No console errors
- [ ] Database has user records

---

## 🎉 Success!

Your EduLift platform is now live at:
- **Frontend:** https://edulift.techxdoz.com
- **Backend API:** https://api.edulift.techxdoz.com

### Next Steps:
1. Change admin password immediately
2. Create real user accounts
3. Test all features thoroughly
4. Set up regular backups
5. Monitor error logs

---

**Deployment Complete! 🎓✨**

*For detailed troubleshooting, see the other deployment guides in the project folder.*
