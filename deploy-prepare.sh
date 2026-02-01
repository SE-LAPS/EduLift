#!/bin/bash
# EduLift Deployment Preparation Script for Linux/Mac
# This script prepares your project for cPanel deployment

echo "========================================"
echo "EduLift Deployment Preparation"
echo "========================================"
echo ""

# Step 1: Generate Security Keys
echo "[1/6] Generating security keys..."
echo ""
echo "SECRET_KEY:"
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
echo ""
echo "JWT_SECRET_KEY:"
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
echo ""
echo "IMPORTANT: Save these keys! You'll need them in .env files."
echo ""
read -p "Press Enter to continue..."

# Step 2: Create Backend .env
echo "[2/6] Creating backend .env file..."
cd backend
if [ -f .env ]; then
    echo ".env already exists. Creating backup..."
    cp .env .env.backup
fi
cp .env.production.example .env
echo "Backend .env created from template."
echo "Please edit backend/.env with your database credentials and security keys."
echo ""
read -p "Press Enter to continue..."

# Step 3: Create Frontend .env.production
echo "[3/6] Creating frontend .env.production file..."
cd ../frontend
if [ -f .env.production ]; then
    echo ".env.production already exists. Creating backup..."
    cp .env.production .env.production.backup
fi
cp .env.production.example .env.production
echo "Frontend .env.production created from template."
echo "Please edit frontend/.env.production with your domain and API URL."
echo ""
read -p "Press Enter to continue..."

# Step 4: Install Frontend Dependencies
echo "[4/6] Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    exit 1
fi
echo "Frontend dependencies installed successfully."
echo ""

# Step 5: Build Frontend
echo "[5/6] Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "Frontend built successfully!"
echo ""

# Step 6: Create Deployment Packages
echo "[6/6] Creating deployment packages..."
cd ..

echo ""
echo "Creating backend.zip..."
zip -r backend-deployment.zip backend/ -x "backend/venv/*" "backend/__pycache__/*" "backend/*.pyc" "backend/.git/*"
echo "Backend package created: backend-deployment.zip"

echo ""
echo "Creating frontend.zip..."
cd frontend
zip -r ../frontend-deployment.zip .next/ public/ .htaccess package.json next.config.js
cd ..
echo "Frontend package created: frontend-deployment.zip"

echo ""
echo "========================================"
echo "Preparation Complete!"
echo "========================================"
echo ""
echo "Files created:"
echo "  - backend-deployment.zip (Upload to cPanel home directory)"
echo "  - frontend-deployment.zip (Upload to cPanel public_html)"
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env with your database credentials"
echo "  2. Edit frontend/.env.production with your domain"
echo "  3. Upload backend-deployment.zip to cPanel"
echo "  4. Upload frontend-deployment.zip to cPanel"
echo "  5. Follow CPANEL_DEPLOYMENT_INSTRUCTIONS.md"
echo ""
