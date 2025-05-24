import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import config
from extensions import db, migrate
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.test_routes import test_bp
from routes.exam_routes import exam_bp
from routes.ml_routes import ml_bp

# Load environment variables
load_dotenv()

def create_app(config_name='development'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(test_bp, url_prefix='/api/tests')
    app.register_blueprint(exam_bp, url_prefix='/api/exams')
    app.register_blueprint(ml_bp, url_prefix='/api/ml')
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({"status": "healthy", "message": "EduLift API is running"}), 200
    
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
