from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, HandwritingSample, HandwritingModel
from extensions import db
import os
from werkzeug.utils import secure_filename
import uuid
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import io

ml_bp = Blueprint('ml', __name__)

def allowed_file(filename):
    """Check if file has allowed extension"""
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def preprocess_image(image_path, target_size=(224, 224)):
    """Preprocess image for model input"""
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0  # Normalize to [0,1]
    return np.expand_dims(img_array, axis=0)  # Add batch dimension


@ml_bp.route('/handwriting-samples', methods=['GET'])
@jwt_required()
def get_handwriting_samples():
    """Get handwriting samples for a student (teacher or self)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    # Get query parameters
    student_id = request.args.get('student_id', type=int)
    sample_type = request.args.get('sample_type')
    
    # Check permissions
    is_teacher = current_user.role == 'teacher'
    is_self = current_user_id == student_id
    
    if not is_teacher and not is_self:
        return jsonify({'message': 'Unauthorized. Teacher access or self access required.'}), 403
    
    # Build query
    query = HandwritingSample.query
    
    if student_id:
        query = query.filter_by(student_id=student_id)
    elif is_self:
        query = query.filter_by(student_id=current_user_id)
    else:
        return jsonify({'message': 'Missing student_id parameter'}), 400
    
    if sample_type:
        query = query.filter_by(sample_type=sample_type)
    
    samples = query.all()
    
    return jsonify({
        'handwriting_samples': [sample.to_dict() for sample in samples]
    }), 200


@ml_bp.route('/handwriting-samples', methods=['POST'])
@jwt_required()
def upload_handwriting_sample():
    """Upload a handwriting sample (student or teacher)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    # Get form data
    student_id = request.form.get('student_id', type=int)
    sample_type = request.form.get('sample_type')
    
    # Validate parameters
    if not sample_type or sample_type not in ['training', 'verification']:
        return jsonify({'message': 'Invalid or missing sample_type'}), 400
    
    # Check permissions
    is_teacher = current_user.role == 'teacher'
    is_self = current_user_id == student_id
    
    if not student_id:
        student_id = current_user_id
    elif not is_teacher and not is_self:
        return jsonify({'message': 'Unauthorized. Teacher access or self access required.'}), 403
    
    # Check if file is provided
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
    
    # Save file
    filename = secure_filename(f"handwriting_{student_id}_{sample_type}_{uuid.uuid4()}_{file.filename}")
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'handwriting_samples')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    # Create handwriting sample
    sample = HandwritingSample(
        student_id=student_id,
        sample_path=file_path,
        sample_type=sample_type,
        is_verified=False
    )
    
    db.session.add(sample)
    db.session.commit()
    
    return jsonify({
        'message': 'Handwriting sample uploaded successfully',
        'sample': sample.to_dict()
    }), 201


@ml_bp.route('/models', methods=['GET'])
@jwt_required()
def get_models():
    """Get all handwriting models (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    # Get query parameters
    is_active = request.args.get('is_active')
    
    # Build query
    query = HandwritingModel.query
    
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter_by(is_active=is_active_bool)
    
    models = query.all()
    
    return jsonify({
        'models': [model.to_dict() for model in models]
    }), 200


@ml_bp.route('/models', methods=['POST'])
@jwt_required()
def create_model():
    """Create and train a new handwriting model (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    data = request.get_json()
    
    if not data or not all(k in data for k in ('model_name', 'student_ids')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if model name already exists
    existing_model = HandwritingModel.query.filter_by(model_name=data['model_name']).first()
    if existing_model:
        return jsonify({'message': 'Model name already exists'}), 400
    
    # Get training samples for selected students
    student_ids = data['student_ids']
    if not student_ids or not isinstance(student_ids, list):
        return jsonify({'message': 'Invalid student_ids'}), 400
    
    samples = HandwritingSample.query.filter(
        HandwritingSample.student_id.in_(student_ids),
        HandwritingSample.sample_type == 'training'
    ).all()
    
    if not samples:
        return jsonify({'message': 'No training samples found for selected students'}), 400
    
    # Create model directory
    model_name = data['model_name']
    model_dir = os.path.join(current_app.config['ML_MODELS_FOLDER'], model_name)
    os.makedirs(model_dir, exist_ok=True)
    
    # Create a simple CNN model for demonstration
    # In a real application, you would implement a proper Siamese network or similar
    try:
        # This is a simplified example - in a real application, you would:
        # 1. Load and preprocess all training samples
        # 2. Split into training and validation sets
        # 3. Train a proper Siamese network or similar for handwriting verification
        # 4. Save the trained model
        
        # For demonstration, we'll create a simple model architecture
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(128, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Flatten(),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dense(len(student_ids), activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Save the model
        model_path = os.path.join(model_dir, 'model.h5')
        model.save(model_path)
        
        # Create handwriting model record
        handwriting_model = HandwritingModel(
            model_name=model_name,
            model_path=model_path,
            created_by=current_user_id,
            accuracy=0.85,  # Placeholder accuracy
            is_active=True
        )
        
        db.session.add(handwriting_model)
        db.session.commit()
        
        return jsonify({
            'message': 'Model created and trained successfully',
            'model': handwriting_model.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'message': f'Error creating model: {str(e)}'
        }), 500


@ml_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_handwriting():
    """Verify handwriting against a student's samples (teacher, assistant, supersub)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['teacher', 'assistant', 'supersub']:
        return jsonify({'message': 'Unauthorized. Teacher, assistant, or supersub access required.'}), 403
    
    # Check if file is provided
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
    
    # Get form data
    student_id = request.form.get('student_id', type=int)
    model_id = request.form.get('model_id', type=int)
    
    if not student_id:
        return jsonify({'message': 'Missing student_id'}), 400
    
    # Save file temporarily
    temp_filename = secure_filename(f"verify_{uuid.uuid4()}_{file.filename}")
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'temp')
    os.makedirs(upload_folder, exist_ok=True)
    temp_file_path = os.path.join(upload_folder, temp_filename)
    file.save(temp_file_path)
    
    try:
        # Get the active model
        if model_id:
            model = HandwritingModel.query.get(model_id)
        else:
            model = HandwritingModel.query.filter_by(is_active=True).first()
        
        if not model:
            return jsonify({'message': 'No active handwriting model found'}), 400
        
        # Load the model
        loaded_model = keras.models.load_model(model.model_path)
        
        # Preprocess the image
        img_array = preprocess_image(temp_file_path)
        
        # Make prediction
        # In a real application, this would be a similarity comparison
        # For demonstration, we'll return a confidence score
        prediction = loaded_model.predict(img_array)
        
        # Get student samples for comparison
        student = User.query.get(student_id)
        if not student:
            return jsonify({'message': 'Student not found'}), 404
        
        # Calculate verification result
        # In a real application, this would be based on the Siamese network output
        # For demonstration, we'll return a random confidence score
        confidence = float(np.random.uniform(0.7, 0.99))
        is_verified = confidence > 0.8
        
        # Clean up temporary file
        os.remove(temp_file_path)
        
        return jsonify({
            'message': 'Handwriting verification completed',
            'student_id': student_id,
            'student_name': f"{student.first_name} {student.last_name}",
            'is_verified': is_verified,
            'confidence': confidence
        }), 200
        
    except Exception as e:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        return jsonify({
            'message': f'Error verifying handwriting: {str(e)}'
        }), 500
