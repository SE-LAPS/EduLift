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

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True)
