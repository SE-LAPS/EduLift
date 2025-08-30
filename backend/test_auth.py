import requests
import json
import jwt
import os
from datetime import datetime

# Test login to get real JWT token
login_data = {
    "username": "student@edulift.com",
    "password": "student123"
}

try:
    # Login request
    response = requests.post("http://localhost:5000/api/auth/login", 
                           json=login_data,
                           headers={"Content-Type": "application/json"})
    
    print("Login Status:", response.status_code)
    if response.status_code == 200:
        result = response.json()
        token = result["access_token"]
        print("Token received:", token[:50] + "...")
        
        # Decode and inspect the JWT token
        try:
            # Load environment variables and get the correct JWT secret
            from dotenv import load_dotenv
            load_dotenv()
            secret = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
            print(f"Using JWT secret: {secret}")
            decoded = jwt.decode(token, secret, algorithms=['HS256'])
            print("Token decoded successfully!")
            print("Token contents:", decoded)
            print("Token expires:", datetime.fromtimestamp(decoded.get('exp', 0)))
        except jwt.ExpiredSignatureError:
            print("Token has expired!")
        except jwt.InvalidTokenError as e:
            print("Token is invalid:", str(e))
        
        # Test profile update with real token
        update_data = {"first_name": "Updated Student"}
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        
        print("\nTesting profile update...")
        update_response = requests.put("http://localhost:5000/api/users/me",
                                     json=update_data, headers=headers)
        
        print("Profile Update Status:", update_response.status_code)
        print("Response:", update_response.text)
        
        # Also test a simple GET request to /users/me
        print("\nTesting GET current user...")
        get_response = requests.get("http://localhost:5000/api/users/me", headers=headers)
        print("GET Status:", get_response.status_code)
        print("GET Response:", get_response.text)
        
    else:
        print("Login failed:", response.text)
        
except Exception as e:
    print("Error:", str(e)) 