#!/usr/bin/env python3
"""
EduLift Backend Startup Script
This script helps initialize and start the EduLift backend with proper configuration checks.
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

def check_dependencies():
    """Check if all required packages are installed"""
    print("🔍 Checking dependencies...")
    
    try:
        import flask
        import flask_sqlalchemy
        import flask_jwt_extended
        import pymysql
        print("[OK] All required packages are installed")
        return True
    except ImportError as e:
        print(f"[ERROR] Missing dependency: {e}")
        print("💡 Run: pip install -r requirements.txt")
        return False

def check_environment():
    """Check environment variables"""
    print("🔍 Checking environment configuration...")
    
    required_vars = ['SECRET_KEY', 'JWT_SECRET_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"[ERROR] Missing environment variables: {', '.join(missing_vars)}")
        print("[TIP] Create a .env file based on .env.example")
        return False
    
    print("[OK] Environment variables configured")
    return True

def check_database():
    """Check database connectivity"""
    print("🔍 Checking database connection...")
    
    try:
        from app import create_app
        from extensions import db
        
        app = create_app()
        with app.app_context():
            db.engine.connect()
            print(f"[OK] Database connection successful: {app.config['SQLALCHEMY_DATABASE_URI']}")
            return True
    except Exception as e:
        print(f"[ERROR] Database connection failed: {str(e)}")
        
        database_url = os.getenv('DEV_DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/edulift_dev')
        
        if 'mysql' in database_url:
            print("\n[TIP] MySQL/XAMPP troubleshooting:")
            print("1. Ensure XAMPP is running (Start Apache & MySQL)")
            print("2. Open XAMPP Control Panel and check MySQL status")
            print("3. Create databases in phpMySQL:")
            print("   - Open http://localhost/phpmyadmin")
            print("   - Create database: edulift_dev")
            print("   - Create database: edulift_test")
            print("4. Verify MySQL is running on port 3306")
            print("5. Check if root user has no password (XAMPP default)")
            print("6. Run: python setup_db.py")
        
        return False

def initialize_database():
    """Initialize database with tables and sample data"""
    print("🔍 Initializing database...")
    
    try:
        result = subprocess.run([sys.executable, 'setup_db.py'], 
                              capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("[OK] Database initialized successfully")
            return True
        else:
            print(f"[ERROR] Database initialization failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"[ERROR] Error running setup_db.py: {str(e)}")
        return False

def start_server():
    """Start the Flask development server"""
    print("🚀 Starting EduLift backend server...")
    
    try:
        from app import create_app
        
        app = create_app()
        port = int(os.getenv('PORT', 5000))
        
        print(f"\n[OK] EduLift backend is starting...")
        print(f"[SERVER] Server will be available at: http://localhost:{port}")
        print(f"[API] API documentation: http://localhost:{port}/api/health")
        print(f"[ENV] Environment: {os.getenv('FLASK_ENV', 'development')}")
        print(f"[DB] Database: MySQL via XAMPP")
        print("\n[INFO] Demo Login Credentials:")
        print("   Admin: admin@edulift.com / admin123")
        print("   Teacher: teacher@edulift.com / teacher123")
        print("   Student: student@edulift.com / student123")
        print("\n[STOP] Press Ctrl+C to stop the server\n")
        
        app.run(host='0.0.0.0', port=port, debug=True)
        
    except Exception as e:
        print(f"[ERROR] Failed to start server: {str(e)}")
        return False

def main():
    """Main startup routine"""
    print("🎓 EduLift Backend Startup Script (MySQL/XAMPP)")
    print("=" * 50)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found")
        print("💡 Copy .env.example to .env and configure your settings")
        
        if os.path.exists('.env.example'):
            choice = input("🤔 Create .env from .env.example? (y/n): ").lower()
            if choice == 'y':
                import shutil
                shutil.copy('.env.example', '.env')
                print("✅ .env file created. Please edit it with your MySQL configuration.")
                print("💡 Then run this script again.")
                return
        return
    
    # Run all checks
    checks = [
        check_dependencies,
        check_environment,
        check_database
    ]
    
    for check in checks:
        if not check():
            print("\n❌ Startup failed. Please fix the issues above and try again.")
            return
    
    # Ask if user wants to reinitialize database
    print("\n🤔 Database initialization:")
    choice = input("   Initialize/Reset database with sample data? (y/n): ").lower()
    
    if choice == 'y':
        if not initialize_database():
            print("\n❌ Database initialization failed. Check the errors above.")
            return
    
    print("\n✅ All checks passed!")
    
    # Start the server
    start_server()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 EduLift backend stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1) 