from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from extensions import db
from sqlalchemy import or_

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin and teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['admin', 'teacher']:
        return jsonify({'message': 'Unauthorized. Admin or teacher access required.'}), 403
    
    # Get query parameters
    role = request.args.get('role')
    search = request.args.get('search')
    is_active = request.args.get('is_active')
    
    # Build query
    query = User.query
    
    if role:
        query = query.filter_by(role=role)
    
    if search:
        query = query.filter(or_(
            User.username.ilike(f'%{search}%'),
            User.email.ilike(f'%{search}%'),
            User.first_name.ilike(f'%{search}%'),
            User.last_name.ilike(f'%{search}%')
        ))
    
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter_by(is_active=is_active_bool)
    
    users = query.all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200


@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a specific user (admin, teacher, or self)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    # Allow access if admin, teacher, or self
    if current_user.role not in ['admin', 'teacher'] and current_user_id != user_id:
        return jsonify({'message': 'Unauthorized. Admin or teacher access required.'}), 403
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200


@user_bp.route('/', methods=['POST'])
@jwt_required()
def create_user():
    """Create a new user (admin only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized. Admin access required.'}), 403
    
    data = request.get_json()
    
    if not data or not all(k in data for k in ('username', 'email', 'password', 'first_name', 'last_name', 'role')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    # Validate role
    valid_roles = ['admin', 'teacher', 'assistant', 'supersub', 'student']
    if data['role'] not in valid_roles:
        return jsonify({'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        role=data['role']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully',
        'user': new_user.to_dict()
    }), 201


@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update a user (admin or self, with restrictions)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    
    # Check permissions
    is_admin = current_user.role == 'admin'
    is_teacher = current_user.role == 'teacher'
    is_self = current_user_id == user_id
    
    # Only admins can update roles and active status
    if 'role' in data and not is_admin:
        return jsonify({'message': 'Unauthorized. Only admins can update roles.'}), 403
    
    if 'is_active' in data and not is_admin:
        return jsonify({'message': 'Unauthorized. Only admins can update active status.'}), 403
    
    # Teachers can update student roles to supersub or assistant
    if is_teacher and 'role' in data:
        if user.role != 'student' or data['role'] not in ['supersub', 'assistant']:
            return jsonify({'message': 'Teachers can only update student roles to supersub or assistant'}), 403
    
    # Update fields
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already exists'}), 400
        user.username = data['username']
    
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400
        user.email = data['email']
    
    if 'first_name' in data:
        user.first_name = data['first_name']
    
    if 'last_name' in data:
        user.last_name = data['last_name']
    
    if 'role' in data and is_admin:
        valid_roles = ['admin', 'teacher', 'assistant', 'supersub', 'student']
        if data['role'] not in valid_roles:
            return jsonify({'message': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        user.role = data['role']
    
    if 'is_active' in data and is_admin:
        user.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict()
    }), 200


@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Delete a user (admin only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized. Admin access required.'}), 403
    
    # Prevent self-deletion
    if current_user_id == user_id:
        return jsonify({'message': 'Cannot delete your own account'}), 400
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User deleted successfully'
    }), 200
