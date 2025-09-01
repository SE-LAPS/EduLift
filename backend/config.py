import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
    ML_MODELS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml_models')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    # MySQL configuration for XAMPP (default XAMPP settings)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DEV_DATABASE_URL', 
        'mysql+pymysql://root:@localhost:3306/edulift_dev'
    )
    REDIS_URL = os.getenv('DEV_REDIS_URL', 'redis://localhost:6379/0')

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'TEST_DATABASE_URL', 
        'mysql+pymysql://root:@localhost:3306/edulift_test'
    )
    REDIS_URL = os.getenv('TEST_REDIS_URL', 'redis://localhost:6379/1')

class ProductionConfig(Config):
    """Production configuration for Railway/cloud deployment"""
    DEBUG = False
    REDIS_URL = os.getenv('REDIS_URL')
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = True
    
    # Production security headers
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # 1 year
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        """Get database URI and validate it exists for production"""
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            raise ValueError("DATABASE_URL environment variable is required for production")
        
        # Handle Railway PostgreSQL URL format
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        return database_url
    
    def __init__(self):
        super().__init__()
        # Validate required environment variables when config is actually used
        secret_key = os.getenv('SECRET_KEY')
        jwt_secret_key = os.getenv('JWT_SECRET_KEY')
        
        if not secret_key or not jwt_secret_key:
            raise ValueError("SECRET_KEY and JWT_SECRET_KEY are required for production")
        
        # Override these in production with strong keys
        self.SECRET_KEY = secret_key
        self.JWT_SECRET_KEY = jwt_secret_key

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
