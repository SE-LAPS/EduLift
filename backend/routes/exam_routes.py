from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Exam, StudentExam, ExamEvaluation
from extensions import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import uuid
import statistics

exam_bp = Blueprint('exams', __name__)

def allowed_file(filename):
    """Check if file has allowed extension"""
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@exam_bp.route('/', methods=['GET'])
@jwt_required()
def get_exams():
    """Get all exams (with filtering options)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    # Get query parameters
    subject = request.args.get('subject')
    is_active = request.args.get('is_active')
    
    # Build query
    query = Exam.query
    
    if subject:
        query = query.filter_by(subject=subject)
    
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter_by(is_active=is_active_bool)
    
    # Filter based on user role
    if current_user.role == 'teacher':
        # Teachers can see all exams
        pass
    elif current_user.role in ['assistant', 'supersub']:
        # Assistants and supersubs can see active exams
        query = query.filter_by(is_active=True)
    elif current_user.role == 'student':
        # Students can only see active exams that they're assigned to
        student_exam_ids = [se.exam_id for se in current_user.student_exams]
        query = query.filter(Exam.id.in_(student_exam_ids), Exam.is_active == True)
    else:
        # Admins can see all exams
        pass
    
    exams = query.all()
    
    return jsonify({
        'exams': [exam.to_dict() for exam in exams]
    }), 200


@exam_bp.route('/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam(exam_id):
    """Get a specific exam"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    exam = Exam.query.get(exam_id)
    
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    # Check permissions for students
    if current_user.role == 'student':
        # Students can only see exams they're assigned to
        student_exam = StudentExam.query.filter_by(student_id=current_user_id, exam_id=exam_id).first()
        if not student_exam:
            return jsonify({'message': 'Unauthorized. You are not assigned to this exam.'}), 403
        
        # Check if exam is active
        if not exam.is_active:
            return jsonify({'message': 'Exam is not currently available'}), 403
    
    # Get exam details
    exam_data = exam.to_dict()
    
    # Add student-specific data if student
    if current_user.role == 'student':
        student_exam = StudentExam.query.filter_by(student_id=current_user_id, exam_id=exam_id).first()
        if student_exam:
            exam_data['student_exam'] = student_exam.to_dict()
    
    return jsonify({
        'exam': exam_data
    }), 200


@exam_bp.route('/', methods=['POST'])
@jwt_required()
def create_exam():
    """Create a new exam (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    data = request.get_json()
    
    if not data or not all(k in data for k in ('title', 'subject', 'exam_date', 'duration_minutes', 'max_score')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new exam
    new_exam = Exam(
        title=data['title'],
        description=data.get('description', ''),
        subject=data['subject'],
        created_by=current_user_id,
        exam_date=datetime.fromisoformat(data['exam_date']),
        duration_minutes=data['duration_minutes'],
        max_score=data['max_score'],
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_exam)
    db.session.commit()
    
    return jsonify({
        'message': 'Exam created successfully',
        'exam': new_exam.to_dict()
    }), 201


@exam_bp.route('/<int:exam_id>', methods=['PUT'])
@jwt_required()
def update_exam(exam_id):
    """Update an exam (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    exam = Exam.query.get(exam_id)
    
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    # Only the creator or admin can update the exam
    if exam.created_by != current_user_id and current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized. Only the creator can update this exam.'}), 403
    
    data = request.get_json()
    
    # Update exam fields
    if 'title' in data:
        exam.title = data['title']
    
    if 'description' in data:
        exam.description = data['description']
    
    if 'subject' in data:
        exam.subject = data['subject']
    
    if 'exam_date' in data:
        exam.exam_date = datetime.fromisoformat(data['exam_date'])
    
    if 'duration_minutes' in data:
        exam.duration_minutes = data['duration_minutes']
    
    if 'max_score' in data:
        exam.max_score = data['max_score']
    
    if 'is_active' in data:
        exam.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exam updated successfully',
        'exam': exam.to_dict()
    }), 200


@exam_bp.route('/<int:exam_id>/assign', methods=['POST'])
@jwt_required()
def assign_exam(exam_id):
    """Assign an exam to students (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    exam = Exam.query.get(exam_id)
    
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    data = request.get_json()
    
    if not data or 'student_ids' not in data or not isinstance(data['student_ids'], list):
        return jsonify({'message': 'Missing student_ids field'}), 400
    
    # Assign exam to students
    assigned_count = 0
    for student_id in data['student_ids']:
        # Check if student exists and is a student
        student = User.query.get(student_id)
        if not student or student.role not in ['student', 'supersub', 'assistant']:
            continue
        
        # Check if student is already assigned to this exam
        existing_assignment = StudentExam.query.filter_by(student_id=student_id, exam_id=exam_id).first()
        if existing_assignment:
            continue
        
        # Create new assignment
        student_exam = StudentExam(
            student_id=student_id,
            exam_id=exam_id,
            status='pending'
        )
        
        db.session.add(student_exam)
        assigned_count += 1
    
    db.session.commit()
    
    return jsonify({
        'message': f'Exam assigned to {assigned_count} students successfully'
    }), 200


@exam_bp.route('/student-exams', methods=['GET'])
@jwt_required()
def get_student_exams():
    """Get all exams for the current student"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Get student exams
    student_exams = StudentExam.query.filter_by(student_id=current_user_id).all()
    
    # Get exam details
    exams_data = []
    for student_exam in student_exams:
        exam = Exam.query.get(student_exam.exam_id)
        if not exam:
            continue
        
        # Check if exam is active
        if not exam.is_active:
            continue
        
        exam_data = exam.to_dict()
        exam_data['student_exam'] = student_exam.to_dict()
        exams_data.append(exam_data)
    
    return jsonify({
        'exams': exams_data
    }), 200


@exam_bp.route('/student-exams/<int:exam_id>/upload', methods=['POST'])
@jwt_required()
def upload_answer_sheet(exam_id):
    """Upload an answer sheet for an exam"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Check if student is assigned to this exam
    student_exam = StudentExam.query.filter_by(student_id=current_user_id, exam_id=exam_id).first()
    
    if not student_exam:
        return jsonify({'message': 'You are not assigned to this exam'}), 404
    
    # Check if exam is active
    exam = Exam.query.get(exam_id)
    if not exam or not exam.is_active:
        return jsonify({'message': 'Exam is not active'}), 400
    
    # Check if file is provided
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
    
    # Save file
    filename = secure_filename(f"{current_user_id}_{exam_id}_{uuid.uuid4()}_{file.filename}")
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'exam_answers')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    # Update student exam
    if student_exam.answer_sheet_path and os.path.exists(student_exam.answer_sheet_path):
        os.remove(student_exam.answer_sheet_path)
    
    student_exam.answer_sheet_path = file_path
    student_exam.status = 'submitted'
    db.session.commit()
    
    return jsonify({
        'message': 'Answer sheet uploaded successfully',
        'file_path': file_path
    }), 200


@exam_bp.route('/evaluations', methods=['GET'])
@jwt_required()
def get_evaluations():
    """Get exams to evaluate (assistant and supersub only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['assistant', 'supersub']:
        return jsonify({'message': 'Unauthorized. Assistant or supersub access required.'}), 403
    
    # Get submitted exams
    student_exams = StudentExam.query.filter_by(status='submitted').all()
    
    # Filter out exams that the current user has already evaluated
    evaluated_ids = [e.student_exam_id for e in ExamEvaluation.query.filter_by(evaluator_id=current_user_id).all()]
    student_exams = [se for se in student_exams if se.id not in evaluated_ids]
    
    # Get exam details
    exams_data = []
    for student_exam in student_exams:
        exam = Exam.query.get(student_exam.exam_id)
        if not exam or not exam.is_active:
            continue
        
        student = User.query.get(student_exam.student_id)
        if not student:
            continue
        
        exam_data = exam.to_dict()
        exam_data['student_exam'] = student_exam.to_dict()
        exam_data['student'] = {
            'id': student.id,
            'username': student.username,
            'first_name': student.first_name,
            'last_name': student.last_name
        }
        exams_data.append(exam_data)
    
    return jsonify({
        'exams_to_evaluate': exams_data
    }), 200


@exam_bp.route('/evaluations/<int:student_exam_id>', methods=['POST'])
@jwt_required()
def evaluate_exam(student_exam_id):
    """Evaluate an exam (assistant and supersub only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['assistant', 'supersub']:
        return jsonify({'message': 'Unauthorized. Assistant or supersub access required.'}), 403
    
    student_exam = StudentExam.query.get(student_exam_id)
    
    if not student_exam:
        return jsonify({'message': 'Student exam not found'}), 404
    
    # Check if exam is submitted
    if student_exam.status != 'submitted':
        return jsonify({'message': 'Exam is not submitted'}), 400
    
    # Check if the evaluator has already evaluated this exam
    existing_evaluation = ExamEvaluation.query.filter_by(
        student_exam_id=student_exam_id,
        evaluator_id=current_user_id
    ).first()
    
    if existing_evaluation:
        return jsonify({'message': 'You have already evaluated this exam'}), 400
    
    data = request.get_json()
    
    if not data or 'score' not in data:
        return jsonify({'message': 'Missing score field'}), 400
    
    # Validate score
    exam = Exam.query.get(student_exam.exam_id)
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    if data['score'] < 0 or data['score'] > exam.max_score:
        return jsonify({'message': f'Score must be between 0 and {exam.max_score}'}), 400
    
    # Create evaluation
    evaluation = ExamEvaluation(
        student_exam_id=student_exam_id,
        evaluator_id=current_user_id,
        score=data['score'],
        feedback=data.get('feedback', ''),
        handwriting_verified=data.get('handwriting_verified', False)
    )
    
    db.session.add(evaluation)
    
    # Update student exam status if it has enough evaluations
    evaluations = ExamEvaluation.query.filter_by(student_exam_id=student_exam_id).all()
    if len(evaluations) + 1 >= 2:  # At least 2 evaluations required
        student_exam.status = 'evaluated'
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exam evaluated successfully',
        'evaluation': evaluation.to_dict()
    }), 201


@exam_bp.route('/teacher/evaluations', methods=['GET'])
@jwt_required()
def get_teacher_evaluations():
    """Get evaluated exams for teacher approval (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    # Get evaluated exams
    student_exams = StudentExam.query.filter_by(status='evaluated').all()
    
    # Get exam details
    exams_data = []
    for student_exam in student_exams:
        exam = Exam.query.get(student_exam.exam_id)
        if not exam:
            continue
        
        student = User.query.get(student_exam.student_id)
        if not student:
            continue
        
        # Get evaluations
        evaluations = ExamEvaluation.query.filter_by(student_exam_id=student_exam.id).all()
        evaluation_data = [e.to_dict() for e in evaluations]
        
        # Calculate average and maximum scores
        scores = [e.score for e in evaluations]
        avg_score = statistics.mean(scores) if scores else 0
        max_score = max(scores) if scores else 0
        
        exam_data = exam.to_dict()
        exam_data['student_exam'] = student_exam.to_dict()
        exam_data['student'] = {
            'id': student.id,
            'username': student.username,
            'first_name': student.first_name,
            'last_name': student.last_name
        }
        exam_data['evaluations'] = evaluation_data
        exam_data['avg_score'] = avg_score
        exam_data['max_score'] = max_score
        
        exams_data.append(exam_data)
    
    return jsonify({
        'exams_for_approval': exams_data
    }), 200


@exam_bp.route('/teacher/approve/<int:student_exam_id>', methods=['POST'])
@jwt_required()
def approve_exam_score(student_exam_id):
    """Approve exam score for display (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    student_exam = StudentExam.query.get(student_exam_id)
    
    if not student_exam:
        return jsonify({'message': 'Student exam not found'}), 404
    
    # Check if exam is evaluated
    if student_exam.status != 'evaluated':
        return jsonify({'message': 'Exam is not evaluated'}), 400
    
    data = request.get_json()
    
    if not data or 'display_score_type' not in data:
        return jsonify({'message': 'Missing display_score_type field'}), 400
    
    # Validate display_score_type
    if data['display_score_type'] not in ['average', 'maximum']:
        return jsonify({'message': 'display_score_type must be either "average" or "maximum"'}), 400
    
    # Get evaluations
    evaluations = ExamEvaluation.query.filter_by(student_exam_id=student_exam_id).all()
    
    if not evaluations:
        return jsonify({'message': 'No evaluations found for this exam'}), 400
    
    # Calculate final score
    scores = [e.score for e in evaluations]
    
    if data['display_score_type'] == 'average':
        final_score = int(statistics.mean(scores))
    else:  # maximum
        final_score = max(scores)
    
    # Update student exam
    student_exam.final_score = final_score
    student_exam.display_score_type = data['display_score_type']
    student_exam.is_approved = True
    student_exam.status = 'approved'
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exam score approved successfully',
        'student_exam': student_exam.to_dict()
    }), 200


@exam_bp.route('/teacher/retract/<int:student_exam_id>', methods=['POST'])
@jwt_required()
def retract_exam_approval(student_exam_id):
    """Retract exam score approval (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    student_exam = StudentExam.query.get(student_exam_id)
    
    if not student_exam:
        return jsonify({'message': 'Student exam not found'}), 404
    
    # Check if exam is approved
    if student_exam.status != 'approved' or not student_exam.is_approved:
        return jsonify({'message': 'Exam is not approved'}), 400
    
    # Retract approval
    student_exam.is_approved = False
    student_exam.status = 'evaluated'
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exam score approval retracted successfully',
        'student_exam': student_exam.to_dict()
    }), 200


@exam_bp.route('/student/marks', methods=['GET'])
@jwt_required()
def get_student_marks():
    """Get approved exam marks for the current student"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Get approved student exams
    student_exams = StudentExam.query.filter_by(
        student_id=current_user_id,
        is_approved=True
    ).all()
    
    # Get exam details
    exams_data = []
    for student_exam in student_exams:
        exam = Exam.query.get(student_exam.exam_id)
        if not exam:
            continue
        
        exam_data = exam.to_dict()
        exam_data['student_exam'] = student_exam.to_dict()
        exam_data['score'] = student_exam.final_score
        exam_data['display_score_type'] = student_exam.display_score_type
        
        exams_data.append(exam_data)
    
    return jsonify({
        'exam_marks': exams_data
    }), 200
