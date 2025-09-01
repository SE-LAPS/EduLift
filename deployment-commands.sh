#!/bin/bash
# EduLift Deployment Commands & Utilities
# Run this script to prepare your project for deployment

echo "🚀 EduLift Deployment Preparation"
echo "=================================="

# Function to generate secure keys
generate_keys() {
    echo "🔐 Generating secure keys..."
    echo ""
    echo "SECRET_KEY:"
    python3 -c "import secrets; print(secrets.token_urlsafe(32))"
    echo ""
    echo "JWT_SECRET_KEY:"  
    python3 -c "import secrets; print(secrets.token_urlsafe(32))"
    echo ""
    echo "⚠️  Save these keys securely - you'll need them for Railway environment variables"
    echo ""
}

# Function to check dependencies
check_dependencies() {
    echo "📦 Checking dependencies..."
    
    # Check if Python is installed
    if command -v python3 &> /dev/null; then
        echo "✅ Python3 is installed: $(python3 --version)"
    else
        echo "❌ Python3 is not installed"
    fi
    
    # Check if Node.js is installed
    if command -v node &> /dev/null; then
        echo "✅ Node.js is installed: $(node --version)"
    else
        echo "❌ Node.js is not installed"
    fi
    
    # Check if npm is installed
    if command -v npm &> /dev/null; then
        echo "✅ npm is installed: $(npm --version)"
    else
        echo "❌ npm is not installed"
    fi
    
    # Check if git is installed
    if command -v git &> /dev/null; then
        echo "✅ Git is installed: $(git --version)"
    else
        echo "❌ Git is not installed"
    fi
    echo ""
}

# Function to test local build
test_local_build() {
    echo "🧪 Testing local build..."
    
    # Test backend
    echo "Testing backend requirements..."
    cd backend
    if pip3 install -r requirements.txt; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Backend dependency installation failed"
    fi
    cd ..
    
    # Test frontend
    echo "Testing frontend build..."
    cd frontend
    if npm install; then
        echo "✅ Frontend dependencies installed successfully"
        if npm run build; then
            echo "✅ Frontend build successful"
        else
            echo "❌ Frontend build failed"
        fi
    else
        echo "❌ Frontend dependency installation failed"
    fi
    cd ..
    echo ""
}

# Function to prepare git repository
prepare_git() {
    echo "📝 Preparing Git repository..."
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        echo "✅ Repository is up to date"
    else
        echo "📝 Committing changes for deployment..."
        git commit -m "Prepare for production deployment to www.EduLiftAI.com"
        echo "✅ Changes committed"
    fi
    echo ""
}

# Function to show next steps
show_next_steps() {
    echo "🎯 Next Steps:"
    echo "=============="
    echo "1. Purchase domain: www.EduLiftAI.com"
    echo "2. Create Railway account: https://railway.app"
    echo "3. Create Vercel account: https://vercel.com"
    echo "4. Follow the DEPLOYMENT_GUIDE.md step by step"
    echo "5. Set up the environment variables using the generated keys above"
    echo ""
    echo "📚 Important Files Created:"
    echo "- DEPLOYMENT_GUIDE.md (Complete deployment instructions)"
    echo "- railway.json (Railway configuration)"
    echo "- Procfile (Railway startup configuration)"
    echo "- frontend/vercel.json (Vercel configuration)"
    echo "- backend/start_production.py (Production startup script)"
    echo ""
    echo "🔗 Useful Links:"
    echo "- Railway Documentation: https://docs.railway.app"
    echo "- Vercel Documentation: https://vercel.com/docs"
    echo "- Next.js Documentation: https://nextjs.org/docs"
    echo ""
}

# Main execution
main() {
    generate_keys
    check_dependencies
    test_local_build
    prepare_git
    show_next_steps
    
    echo "✨ EduLift is ready for deployment!"
    echo "📖 Follow DEPLOYMENT_GUIDE.md for complete instructions"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 