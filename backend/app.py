import os
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

def create_app(config_name=None):
    """Create and configure the Flask application"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configure CORS based on environment
    if config_name == 'production':
        # Production CORS - restrict to your domain
        CORS(app, resources={
            r"/api/*": {
                "origins": [
                    "https://www.eduliftai.com",
                    "https://eduliftai.com",
                    "https://edulift-frontend.vercel.app"  # Temporary for testing
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True
            }
        })
    else:
        # Development CORS - allow all origins
        CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize extensions
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
        return jsonify({
            "status": "healthy", 
            "message": "EduLift API is running",
            "environment": config_name,
            "version": "1.0.0"
        }), 200
    
    @app.route('/')
    def root():
        """Root endpoint with API information"""
        return jsonify({
            "message": "Welcome to EduLift API",
            "version": "1.0.0",
            "environment": config_name,
            "documentation": "/api/health for health check",
            "endpoints": {
                "auth": "/api/auth",
                "users": "/api/users", 
                "tests": "/api/tests",
                "exams": "/api/exams",
                "ml": "/api/ml",
                "career_guidance": "/api/career-guidance",
                "talent_identification": "/api/talent-identification",
                "test_management": "/api/test-management"
            }
        }), 200
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            "error": "Not Found",
            "message": "The requested resource could not be found.",
            "status_code": 404
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        return jsonify({
            "error": "Internal Server Error",
            "message": "An internal server error occurred.",
            "status_code": 500
        }), 500
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "message": "Token has expired",
            "error": "token_expired"
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "message": "Invalid token",
            "error": "invalid_token"
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "message": "Authorization token is required",
            "error": "authorization_required"
        }), 401
    
    return app

# For development server
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
