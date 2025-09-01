#!/usr/bin/env python3
"""
Production startup script for EduLift
This script handles database initialization and application startup
"""

import os
import sys
from app import create_app
from extensions import db
from models import User
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def initialize_production_db():
    """Initialize production database with admin user"""
    app = create_app('production')
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("[PROD] Database tables created successfully")
            
            # Check if admin user exists
            admin = User.query.filter_by(username='admin@eduliftai.com').first()
            
            if not admin:
                # Create production admin user
                admin = User(
                    username='admin@eduliftai.com',
                    email='admin@eduliftai.com',
                    password=os.getenv('ADMIN_PASSWORD', 'change-this-password'),
                    first_name='Admin',
                    last_name='User',
                    role='admin'
                )
                
                db.session.add(admin)
                db.session.commit()
                
                print('[PROD] Production admin user created')
                print('Admin: admin@eduliftai.com')
            else:
                print('[PROD] Admin user already exists')
            
            print('[PROD] Database initialization completed')
            
        except Exception as e:
            print(f"[ERROR] Production database setup failed: {str(e)}")
            sys.exit(1)

if __name__ == '__main__':
    # Initialize database on first run
    if os.getenv('INIT_DB', 'false').lower() == 'true':
        initialize_production_db()
    
    # Start the application
    app = create_app('production')
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port) 