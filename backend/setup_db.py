import os
import sys
import pymysql
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
        try:
            # Test database connection
            db.engine.connect()
            print(f"[OK] Database connection successful: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            # Create all tables
            db.create_all()
            print("[OK] Database tables created successfully")
            
            # Check if admin user exists
            admin = User.query.filter_by(username='admin@edulift.com').first()
            
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
                
                # Create sample users for different roles
                sample_users = [
                    {
                        'username': 'teacher@edulift.com',
                        'email': 'teacher@edulift.com',
                        'password': 'teacher123',
                        'first_name': 'Teacher',
                        'last_name': 'Demo',
                        'role': 'teacher'
                    },
                    {
                        'username': 'student@edulift.com',
                        'email': 'student@edulift.com',
                        'password': 'student123',
                        'first_name': 'Student',
                        'last_name': 'Demo',
                        'role': 'student'
                    },
                    {
                        'username': 'assistant@edulift.com',
                        'email': 'assistant@edulift.com',
                        'password': 'assistant123',
                        'first_name': 'Assistant',
                        'last_name': 'Demo',
                        'role': 'assistant'
                    }
                ]
                
                for user_data in sample_users:
                    user = User(**user_data)
                    db.session.add(user)
                
                db.session.commit()
                
                print('[OK] Admin user and sample users created successfully')
                print('\n[INFO] Demo Login Credentials:')
                print('Admin: admin@edulift.com / admin123')
                print('Teacher: teacher@edulift.com / teacher123')
                print('Student: student@edulift.com / student123')
                print('Assistant: assistant@edulift.com / assistant123')
            else:
                print('[INFO] Admin user already exists')
            
            print('\n[OK] Database setup completed successfully')
            
        except Exception as e:
            print(f"[ERROR] Database setup failed: {str(e)}")
            print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            if 'mysql' in app.config['SQLALCHEMY_DATABASE_URI']:
                print("\n💡 MySQL/XAMPP Connection Tips:")
                print("1. Make sure XAMPP is running (Apache & MySQL)")
                print("2. Open phpMyAdmin (http://localhost/phpmyadmin)")
                print("3. Create the databases:")
                print("   - CREATE DATABASE edulift_dev;")
                print("   - CREATE DATABASE edulift_test;")
                print("4. Check if MySQL is running on port 3306")
                print("5. Verify no password is set for 'root' user (XAMPP default)")
                print("6. If you have a MySQL password, update the .env file")
            
            sys.exit(1)

if __name__ == '__main__':
    setup_database()
