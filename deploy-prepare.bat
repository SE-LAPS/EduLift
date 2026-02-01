@echo off
REM EduLift Deployment Preparation Script for Windows
REM This script prepares your project for cPanel deployment

echo ========================================
echo EduLift Deployment Preparation
echo ========================================
echo.

REM Step 1: Generate Security Keys
echo [1/6] Generating security keys...
echo.
echo SECRET_KEY:
python -c "import secrets; print(secrets.token_urlsafe(32))"
echo.
echo JWT_SECRET_KEY:
python -c "import secrets; print(secrets.token_urlsafe(32))"
echo.
echo IMPORTANT: Save these keys! You'll need them in .env files.
echo.
pause

REM Step 2: Create Backend .env
echo [2/6] Creating backend .env file...
cd backend
if exist .env (
    echo .env already exists. Creating backup...
    copy .env .env.backup
)
copy .env.production.example .env
echo Backend .env created from template.
echo Please edit backend\.env with your database credentials and security keys.
echo.
pause

REM Step 3: Create Frontend .env.production
echo [3/6] Creating frontend .env.production file...
cd ..\frontend
if exist .env.production (
    echo .env.production already exists. Creating backup...
    copy .env.production .env.production.backup
)
copy .env.production.example .env.production
echo Frontend .env.production created from template.
echo Please edit frontend\.env.production with your domain and API URL.
echo.
pause

REM Step 4: Install Frontend Dependencies
echo [4/6] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully.
echo.

REM Step 5: Build Frontend
echo [5/6] Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Frontend built successfully!
echo.

REM Step 6: Create Deployment Packages
echo [6/6] Creating deployment packages...
cd ..

echo.
echo Creating backend.zip...
powershell Compress-Archive -Path backend\* -DestinationPath backend-deployment.zip -Force
echo Backend package created: backend-deployment.zip

echo.
echo Creating frontend.zip...
powershell Compress-Archive -Path frontend\.next, frontend\public, frontend\.htaccess, frontend\package.json, frontend\next.config.js -DestinationPath frontend-deployment.zip -Force
echo Frontend package created: frontend-deployment.zip

echo.
echo ========================================
echo Preparation Complete!
echo ========================================
echo.
echo Files created:
echo   - backend-deployment.zip (Upload to cPanel home directory)
echo   - frontend-deployment.zip (Upload to cPanel public_html)
echo.
echo Next steps:
echo   1. Edit backend\.env with your database credentials
echo   2. Edit frontend\.env.production with your domain
echo   3. Upload backend-deployment.zip to cPanel
echo   4. Upload frontend-deployment.zip to cPanel
echo   5. Follow CPANEL_DEPLOYMENT_INSTRUCTIONS.md
echo.
pause
