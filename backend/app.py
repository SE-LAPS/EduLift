#!/usr/bin/env python3
"""
EduLift Backend Application
Consolidated Flask application with integrated startup checks and initialization.
"""

import os
import sys
import subprocess
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from config import config
from extensions import db, migrate
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.test_routes import test_bp
from routes.exam_routes import exam_bp
from routes.ml_routes import ml_bp
from routes.career_guidance import career_guidance_bp
from routes.talent_identification import talent_identification_bp
from routes.test_management import test_management_bp

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

def create_app(config_name='development'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with explicit CORS configuration
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(test_bp, url_prefix='/api/tests')
    app.register_blueprint(exam_bp, url_prefix='/api/exams')
    app.register_blueprint(ml_bp, url_prefix='/api/ml')
    app.register_blueprint(career_guidance_bp, url_prefix='/api/career-guidance')
    app.register_blueprint(talent_identification_bp, url_prefix='/api/talent-identification')
    app.register_blueprint(test_management_bp, url_prefix='/api/test-management')
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({"status": "healthy", "message": "EduLift API is running"}), 200
    
    @app.route('/')
    def root():
        """Root endpoint with API information"""
        return jsonify({
            "name": "EduLift API",
            "version": "1.0.0",
            "status": "running",
            "message": "Welcome to EduLift API. Use /api/* endpoints.",
            "endpoints": {
                "health": "/api/health",
                "auth": "/api/auth/*",
                "users": "/api/users/*",
                "tests": "/api/tests/*",
                "exams": "/api/exams/*",
                "ml": "/api/ml/*",
                "career_guidance": "/api/career-guidance/*",
                "talent_identification": "/api/talent-identification/*",
                "test_management": "/api/test-management/*"
            }
        }), 200
    
    @app.route('/favicon.ico')
    def favicon():
        """Favicon endpoint"""
        return '', 204  # No content response
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'status': 401,
            'sub_status': 42,
            'message': 'The token has expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'status': 401,
            'sub_status': 43,
            'message': 'Invalid token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'status': 401,
            'sub_status': 44,
            'message': 'Access token is required'
        }), 401
    
    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({
            'status': 401,
            'sub_status': 45,
            'message': 'Fresh token required'
        }), 401
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'status': 401,
            'sub_status': 46,
            'message': 'Token has been revoked'
        }), 401
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'status': 404,
            'message': 'Resource not found'
        }), 404
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            'status': 500,
            'message': 'Internal server error'
        }), 500
    
    return app

def run_startup_checks():
    """Run all startup checks and initialization"""
    print("🎓 EduLift Backend Startup (MySQL/XAMPP)")
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
                return False
        return False
    
    # Run all checks
    checks = [
        check_dependencies,
        check_environment,
        check_database
    ]
    
    for check in checks:
        if not check():
            print("\n❌ Startup failed. Please fix the issues above and try again.")
            return False
    
    # Ask if user wants to reinitialize database
    print("\n🤔 Database initialization:")
    choice = input("   Initialize/Reset database with sample data? (y/n): ").lower()
    
    if choice == 'y':
        if not initialize_database():
            print("\n❌ Database initialization failed. Check the errors above.")
            return False
    
    print("\n✅ All checks passed!")
    return True

def start_server():
    """Start the Flask development server with startup information"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    port = int(os.getenv('PORT', 5000))
    
    print(f"\n🚀 EduLift backend is starting...")
    print(f"[SERVER] Server available at: http://localhost:{port}")
    print(f"[API] API health check: http://localhost:{port}/api/health")
    print(f"[ENV] Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"[DB] Database: MySQL via XAMPP")
    print("\n[INFO] Demo Login Credentials:")
    print("   Admin: admin@edulift.com / admin123")
    print("   Teacher: teacher@edulift.com / teacher123")
    print("   Student: student@edulift.com / student123")
    print("\n[STOP] Press Ctrl+C to stop the server\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)

if __name__ == '__main__':
    try:
        # Run startup checks first
        if run_startup_checks():
            start_server()
    except KeyboardInterrupt:
        print("\n\n👋 EduLift backend stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1)
