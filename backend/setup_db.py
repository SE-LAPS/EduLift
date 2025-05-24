import os
from app import create_app
from extensions import db
from models import User
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_database():
    """Set up the database and create initial admin user"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user exists
        admin = User.query.filter_by(username='admin').first()
        
        if not admin:
            # Create admin user
            admin = User(
                username='admin@edulift.com',
                email='admin@edulift.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            
            db.session.add(admin)
            db.session.commit()
            
            print('Admin user created successfully')
        else:
            print('Admin user already exists')
        
        print('Database setup completed successfully')

if __name__ == '__main__':
    setup_database()
