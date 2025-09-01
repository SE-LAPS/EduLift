# 🚀 EduLift Deployment Guide: www.EduLiftAI.com

This guide will walk you through deploying your EduLift application to www.EduLiftAI.com using Railway (backend) and Vercel (frontend).

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Git repository with your EduLift code
- [ ] Domain name: www.EduLiftAI.com (purchased from registrar)
- [ ] GitHub/GitLab account
- [ ] Railway account (railway.app)
- [ ] Vercel account (vercel.com)

## 🎯 Deployment Architecture

```
www.EduLiftAI.com (Frontend - Vercel)
        ↓
Railway Backend API (backend-edulift.railway.app)
        ↓
Railway PostgreSQL Database
```

## Phase 1: Backend Deployment (Railway) 🛤️

### Step 1: Prepare Repository

1. **Push your code to GitHub/GitLab** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

### Step 2: Deploy Backend on Railway

1. **Visit Railway**: Go to https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project**: Click "New Project"
4. **Deploy from GitHub**: Select your EduLift repository
5. **Select Service**: Choose "Deploy from GitHub repo"

### Step 3: Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secure-production-secret-key-here-minimum-32-chars
JWT_SECRET_KEY=your-super-secure-jwt-production-key-here-minimum-32-chars

# Frontend URL (update after Vercel deployment)
FRONTEND_URL=https://www.eduliftai.com

# Admin Configuration
ADMIN_PASSWORD=your-secure-admin-password-here

# Database Initialization
INIT_DB=true
```

**🔐 Generate Strong Keys:**
```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate JWT_SECRET_KEY  
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Add PostgreSQL Database

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically set `DATABASE_URL` environment variable

### Step 5: Deploy Backend

1. **Deploy**: Railway will automatically detect Python and deploy
2. **Monitor logs**: Check deployment logs for any errors
3. **Get URL**: Note your Railway app URL (e.g., `backend-edulift.railway.app`)

### Step 6: Initialize Database

1. **Set INIT_DB=true** in Railway environment variables
2. **Redeploy** to initialize database with admin user
3. **Set INIT_DB=false** after successful initialization

## Phase 2: Frontend Deployment (Vercel) ⚡

### Step 1: Prepare Frontend

1. **Update API URL** in frontend code if needed
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

### Step 2: Deploy on Vercel

1. **Visit Vercel**: Go to https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**: Click "Add New..." → "Project"
4. **Select Repository**: Choose your EduLift repository
5. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Configure Environment Variables

In Vercel dashboard, go to Project Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SITE_URL=https://www.eduliftai.com
```

### Step 4: Deploy Frontend

1. **Deploy**: Vercel will automatically build and deploy
2. **Get URL**: Note your Vercel app URL (e.g., `edulift-frontend.vercel.app`)

## Phase 3: Domain Configuration 🌐

### Step 1: Configure Custom Domain

**In Vercel Dashboard:**
1. Go to Project Settings → **Domains**
2. Add custom domain: `www.eduliftai.com`
3. Add redirect from: `eduliftai.com` → `www.eduliftai.com`

### Step 2: Update DNS Records

**In your domain registrar (GoDaddy, Namecheap, etc.):**

Add these DNS records:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @  
Value: 76.76.19.19

Type: A
Name: @
Value: 76.76.21.21
```

### Step 3: Update Backend CORS

**In Railway environment variables:**
Update `FRONTEND_URL` to: `https://www.eduliftai.com`

## Phase 4: Final Configuration & Testing 🧪

### Step 1: Update Backend CORS

Ensure your backend config allows your domain:
- The updated `app.py` already includes `www.eduliftai.com` in CORS origins

### Step 2: Test Deployment

1. **Visit**: https://www.eduliftai.com
2. **Test Login**:
   - Username: `admin@eduliftai.com`
   - Password: [Your ADMIN_PASSWORD]
3. **Test API**: Check https://your-railway-app.railway.app/api/health
4. **Test Features**: Verify all functionality works

### Step 3: SSL Verification

- Vercel automatically provides SSL certificates
- Verify HTTPS is working: https://www.eduliftai.com
- Check SSL certificate details in browser

## 📊 Monitoring & Maintenance

### Health Checks

- **Backend Health**: https://your-railway-app.railway.app/api/health
- **Frontend**: https://www.eduliftai.com
- **Database**: Monitor in Railway dashboard

### Performance Monitoring

- **Vercel Analytics**: Enable in Vercel dashboard
- **Railway Metrics**: Monitor CPU, memory, and response times
- **Database**: Monitor connection counts and query performance

### Backup Strategy

1. **Database Backups**: 
   - Railway provides automatic backups
   - Consider additional backup strategies for critical data

2. **Code Backup**: 
   - Ensure code is in version control (GitHub/GitLab)
   - Tag releases for easy rollbacks

## 🔒 Security Checklist

- [ ] Strong SECRET_KEY and JWT_SECRET_KEY generated
- [ ] ADMIN_PASSWORD is secure and not default
- [ ] CORS properly configured for production domain
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables properly set
- [ ] No sensitive data in code repository

## 🛠️ Troubleshooting

### Common Issues

**1. API Connection Failed**
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check Railway app is running
- Verify CORS configuration

**2. Database Connection Error**
- Check Railway PostgreSQL is running
- Verify `DATABASE_URL` is set
- Check database initialization logs

**3. Domain Not Working**
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain configuration in Vercel

**4. Login Not Working**
- Verify admin user was created during deployment
- Check `ADMIN_PASSWORD` environment variable
- Test with backend health endpoint first

### Getting Help

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Deployment Logs**: Check Railway and Vercel dashboards

## 🎉 Success! 

Your EduLift application should now be live at **www.EduLiftAI.com**!

### Next Steps

1. **Custom Domain Email**: Set up professional email addresses
2. **Analytics**: Set up Google Analytics or similar
3. **Monitoring**: Set up uptime monitoring
4. **Content**: Add your content and customize for your needs
5. **SEO**: Optimize for search engines
6. **Users**: Start onboarding your users!

---

## 📞 Support

If you encounter issues during deployment:

1. Check the logs in Railway and Vercel dashboards
2. Verify all environment variables are correctly set
3. Test each component individually (backend API, frontend, database)
4. Ensure domain DNS has propagated

**Congratulations on deploying EduLift! 🎓✨** 