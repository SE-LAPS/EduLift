#!/usr/bin/env python3
"""
MySQL Connection Test for EduLift
This script tests if we can connect to MySQL via XAMPP
"""

import pymysql
import sys

def test_mysql_connection():
    """Test MySQL connection with XAMPP default settings"""
    
    print("🔍 Testing MySQL connection...")
    print("=" * 50)
    
    # XAMPP default MySQL settings
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',  # Default XAMPP has no password
        'charset': 'utf8mb4'
    }
    
    try:
        # Test basic connection
        print(f"🔌 Connecting to MySQL at {config['host']}:{config['port']}...")
        connection = pymysql.connect(**config)
        print("✅ MySQL connection successful!")
        
        # Test database operations
        with connection.cursor() as cursor:
            # Show existing databases
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            
            print(f"\n📊 Available databases:")
            for db in databases:
                print(f"   - {db[0]}")
            
            # Check if our databases exist
            db_names = [db[0] for db in databases]
            
            print(f"\n🎯 EduLift database status:")
            if 'edulift_dev' in db_names:
                print("   ✅ edulift_dev exists")
            else:
                print("   ❌ edulift_dev NOT found")
                print("      💡 Create it: CREATE DATABASE edulift_dev;")
            
            if 'edulift_test' in db_names:
                print("   ✅ edulift_test exists")
            else:
                print("   ❌ edulift_test NOT found")
                print("      💡 Create it: CREATE DATABASE edulift_test;")
        
        connection.close()
        
        print(f"\n🎉 MySQL connection test completed successfully!")
        print(f"\n📝 Next steps:")
        print(f"   1. Create missing databases in phpMyAdmin")
        print(f"   2. Run: python setup_db.py")
        print(f"   3. Start the application: python start.py")
        
        return True
        
    except pymysql.Error as e:
        print(f"❌ MySQL connection failed: {e}")
        
        print(f"\n💡 Troubleshooting tips:")
        print(f"   1. Ensure XAMPP is running")
        print(f"   2. Check MySQL is started in XAMPP Control Panel")
        print(f"   3. Verify MySQL is running on port 3306")
        print(f"   4. Check if you've set a MySQL root password")
        print(f"   5. Open phpMyAdmin: http://localhost/phpmyadmin")
        
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = test_mysql_connection()
    sys.exit(0 if success else 1) 