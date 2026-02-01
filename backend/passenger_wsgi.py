"""
cPanel Passenger WSGI Entry Point for EduLift Backend
This file is required by cPanel's Python application hosting (Phusion Passenger)
"""
import sys
import os

# Add your application directory to the Python path
INTERP = os.path.join(os.environ['HOME'], 'virtualenv', 'backend', '3.8', 'bin', 'python3')
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Add application directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables from .env file
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Import Flask application
from app import create_app

# Create the application instance for production
application = create_app('production')

# This is what cPanel Passenger will use to run the app
if __name__ == '__main__':
    application.run()
