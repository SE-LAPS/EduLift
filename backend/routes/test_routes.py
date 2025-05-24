from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Test, TestQuestion, TestQuestionOption, StudentTest, StudentAnswer
from extensions import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import uuid

test_bp = Blueprint('tests', __name__)

def allowed_file(filename):
    """Check if file has allowed extension"""
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@test_bp.route('/', methods=['GET'])
@jwt_required()
def get_tests():
    """Get all tests (with filtering options)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    # Get query parameters
    subject = request.args.get('subject')
    concept = request.args.get('concept')
    is_active = request.args.get('is_active')
    
    # Build query
    query = Test.query
    
    if subject:
        query = query.filter_by(subject=subject)
    
    if concept:
        query = query.filter_by(concept=concept)
    
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter_by(is_active=is_active_bool)
    
    # Filter based on user role
    if current_user.role == 'teacher':
        # Teachers can see all tests
        pass
    elif current_user.role in ['assistant', 'supersub']:
        # Assistants and supersubs can see active tests
        query = query.filter_by(is_active=True)
    elif current_user.role == 'student':
        # Students can only see active tests that they're assigned to
        student_test_ids = [st.test_id for st in current_user.student_tests]
        query = query.filter(Test.id.in_(student_test_ids), Test.is_active == True)
    else:
        # Admins can see all tests
        pass
    
    tests = query.all()
    
    return jsonify({
        'tests': [test.to_dict() for test in tests]
    }), 200


@test_bp.route('/<int:test_id>', methods=['GET'])
@jwt_required()
def get_test(test_id):
    """Get a specific test with its questions"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
    
    test = Test.query.get(test_id)
    
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    # Check permissions
    if current_user.role == 'student':
        # Students can only see tests they're assigned to
        student_test = StudentTest.query.filter_by(student_id=current_user_id, test_id=test_id).first()
        if not student_test:
            return jsonify({'message': 'Unauthorized. You are not assigned to this test.'}), 403
        
        # Check if test is active and within time window
        now = datetime.utcnow()
        if not test.is_active or now < test.start_time or now > test.end_time:
            return jsonify({'message': 'Test is not currently available'}), 403
    
    # Get test details
    test_data = test.to_dict()
    
    # Add questions (and options for non-students)
    questions = []
    for question in test.questions:
        q_data = question.to_dict()
        
        # For students during a test, don't include correct answer information
        if current_user.role == 'student':
            # Remove correct answer information
            if 'options' in q_data:
                for option in q_data['options']:
                    if 'is_correct' in option:
                        del option['is_correct']
        
        questions.append(q_data)
    
    test_data['questions'] = questions
    
    return jsonify({
        'test': test_data
    }), 200


@test_bp.route('/', methods=['POST'])
@jwt_required()
def create_test():
    """Create a new test (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    data = request.get_json()
    
    if not data or not all(k in data for k in ('title', 'subject', 'concept', 'start_time', 'end_time', 'duration_minutes', 'max_score')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new test
    new_test = Test(
        title=data['title'],
        description=data.get('description', ''),
        subject=data['subject'],
        concept=data['concept'],
        created_by=current_user_id,
        start_time=datetime.fromisoformat(data['start_time']),
        end_time=datetime.fromisoformat(data['end_time']),
        duration_minutes=data['duration_minutes'],
        max_score=data['max_score'],
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_test)
    db.session.flush()  # Get the test ID without committing
    
    # Add questions if provided
    if 'questions' in data and isinstance(data['questions'], list):
        for q_data in data['questions']:
            if not all(k in q_data for k in ('question_text', 'question_type', 'points')):
                db.session.rollback()
                return jsonify({'message': 'Missing required fields in question'}), 400
            
            question = TestQuestion(
                test_id=new_test.id,
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                points=q_data['points']
            )
            
            db.session.add(question)
            db.session.flush()  # Get the question ID without committing
            
            # Add options for MCQ questions
            if q_data['question_type'] == 'mcq' and 'options' in q_data and isinstance(q_data['options'], list):
                for opt_data in q_data['options']:
                    if not all(k in opt_data for k in ('option_text', 'is_correct')):
                        db.session.rollback()
                        return jsonify({'message': 'Missing required fields in option'}), 400
                    
                    option = TestQuestionOption(
                        question_id=question.id,
                        option_text=opt_data['option_text'],
                        is_correct=opt_data['is_correct']
                    )
                    
                    db.session.add(option)
    
    # Commit all changes
    db.session.commit()
    
    return jsonify({
        'message': 'Test created successfully',
        'test': new_test.to_dict()
    }), 201


@test_bp.route('/<int:test_id>', methods=['PUT'])
@jwt_required()
def update_test(test_id):
    """Update a test (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    test = Test.query.get(test_id)
    
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    # Only the creator or admin can update the test
    if test.created_by != current_user_id and current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized. Only the creator can update this test.'}), 403
    
    data = request.get_json()
    
    # Update test fields
    if 'title' in data:
        test.title = data['title']
    
    if 'description' in data:
        test.description = data['description']
    
    if 'subject' in data:
        test.subject = data['subject']
    
    if 'concept' in data:
        test.concept = data['concept']
    
    if 'start_time' in data:
        test.start_time = datetime.fromisoformat(data['start_time'])
    
    if 'end_time' in data:
        test.end_time = datetime.fromisoformat(data['end_time'])
    
    if 'duration_minutes' in data:
        test.duration_minutes = data['duration_minutes']
    
    if 'max_score' in data:
        test.max_score = data['max_score']
    
    if 'is_active' in data:
        test.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Test updated successfully',
        'test': test.to_dict()
    }), 200


@test_bp.route('/<int:test_id>/questions', methods=['POST'])
@jwt_required()
def add_question(test_id):
    """Add a question to a test (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    test = Test.query.get(test_id)
    
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    # Only the creator or admin can add questions
    if test.created_by != current_user_id and current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized. Only the creator can add questions to this test.'}), 403
    
    data = request.get_json()
    
    if not data or not all(k in data for k in ('question_text', 'question_type', 'points')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new question
    question = TestQuestion(
        test_id=test_id,
        question_text=data['question_text'],
        question_type=data['question_type'],
        points=data['points']
    )
    
    db.session.add(question)
    db.session.flush()  # Get the question ID without committing
    
    # Add options for MCQ questions
    if data['question_type'] == 'mcq' and 'options' in data and isinstance(data['options'], list):
        for opt_data in data['options']:
            if not all(k in opt_data for k in ('option_text', 'is_correct')):
                db.session.rollback()
                return jsonify({'message': 'Missing required fields in option'}), 400
            
            option = TestQuestionOption(
                question_id=question.id,
                option_text=opt_data['option_text'],
                is_correct=opt_data['is_correct']
            )
            
            db.session.add(option)
    
    # Commit all changes
    db.session.commit()
    
    return jsonify({
        'message': 'Question added successfully',
        'question': question.to_dict()
    }), 201


@test_bp.route('/<int:test_id>/assign', methods=['POST'])
@jwt_required()
def assign_test(test_id):
    """Assign a test to students (teacher only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'teacher':
        return jsonify({'message': 'Unauthorized. Teacher access required.'}), 403
    
    test = Test.query.get(test_id)
    
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    data = request.get_json()
    
    if not data or 'student_ids' not in data or not isinstance(data['student_ids'], list):
        return jsonify({'message': 'Missing student_ids field'}), 400
    
    # Assign test to students
    assigned_count = 0
    for student_id in data['student_ids']:
        # Check if student exists and is a student
        student = User.query.get(student_id)
        if not student or student.role not in ['student', 'supersub', 'assistant']:
            continue
        
        # Check if student is already assigned to this test
        existing_assignment = StudentTest.query.filter_by(student_id=student_id, test_id=test_id).first()
        if existing_assignment:
            continue
        
        # Create new assignment
        student_test = StudentTest(
            student_id=student_id,
            test_id=test_id,
            status='not_started'
        )
        
        db.session.add(student_test)
        assigned_count += 1
    
    db.session.commit()
    
    return jsonify({
        'message': f'Test assigned to {assigned_count} students successfully'
    }), 200


@test_bp.route('/student-tests', methods=['GET'])
@jwt_required()
def get_student_tests():
    """Get all tests for the current student"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Get student tests
    student_tests = StudentTest.query.filter_by(student_id=current_user_id).all()
    
    # Get test details
    tests_data = []
    for student_test in student_tests:
        test = Test.query.get(student_test.test_id)
        if not test:
            continue
        
        # Check if test is active
        if not test.is_active:
            continue
        
        test_data = test.to_dict()
        test_data['student_test'] = student_test.to_dict()
        tests_data.append(test_data)
    
    return jsonify({
        'tests': tests_data
    }), 200


@test_bp.route('/student-tests/<int:test_id>/start', methods=['POST'])
@jwt_required()
def start_test(test_id):
    """Start a test for the current student"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Check if student is assigned to this test
    student_test = StudentTest.query.filter_by(student_id=current_user_id, test_id=test_id).first()
    
    if not student_test:
        return jsonify({'message': 'You are not assigned to this test'}), 404
    
    # Check if test is active and within time window
    test = Test.query.get(test_id)
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    now = datetime.utcnow()
    if not test.is_active:
        return jsonify({'message': 'Test is not active'}), 400
    
    if now < test.start_time:
        return jsonify({'message': 'Test has not started yet'}), 400
    
    if now > test.end_time:
        return jsonify({'message': 'Test has ended'}), 400
    
    # Check if test is already started or completed
    if student_test.status not in ['not_started', 'in_progress']:
        return jsonify({'message': f'Test is already {student_test.status}'}), 400
    
    # Start the test
    student_test.status = 'in_progress'
    student_test.start_time = now
    db.session.commit()
    
    return jsonify({
        'message': 'Test started successfully',
        'student_test': student_test.to_dict()
    }), 200


@test_bp.route('/student-tests/<int:test_id>/submit', methods=['POST'])
@jwt_required()
def submit_test(test_id):
    """Submit a test for the current student"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Check if student is assigned to this test
    student_test = StudentTest.query.filter_by(student_id=current_user_id, test_id=test_id).first()
    
    if not student_test:
        return jsonify({'message': 'You are not assigned to this test'}), 404
    
    # Check if test is in progress
    if student_test.status != 'in_progress':
        return jsonify({'message': 'Test is not in progress'}), 400
    
    data = request.get_json()
    
    if not data or 'answers' not in data or not isinstance(data['answers'], list):
        return jsonify({'message': 'Missing answers field'}), 400
    
    # Get test details
    test = Test.query.get(test_id)
    if not test:
        return jsonify({'message': 'Test not found'}), 404
    
    # Process answers
    total_score = 0
    for answer_data in data['answers']:
        if not all(k in answer_data for k in ('question_id',)):
            continue
        
        question = TestQuestion.query.get(answer_data['question_id'])
        if not question or question.test_id != test_id:
            continue
        
        # Create answer based on question type
        answer = StudentAnswer(
            student_test_id=student_test.id,
            question_id=question.id
        )
        
        if question.question_type == 'mcq':
            if 'selected_option_id' in answer_data:
                answer.selected_option_id = answer_data['selected_option_id']
                
                # Check if answer is correct
                option = TestQuestionOption.query.get(answer_data['selected_option_id'])
                if option and option.question_id == question.id:
                    answer.is_correct = option.is_correct
                    if option.is_correct:
                        answer.score = question.points
                        total_score += question.points
        else:
            # For short_answer and essay questions
            if 'answer_text' in answer_data:
                answer.answer_text = answer_data['answer_text']
            
            # For file uploads (handwritten answers)
            if 'answer_file_path' in answer_data:
                answer.answer_file_path = answer_data['answer_file_path']
        
        db.session.add(answer)
    
    # Update student test
    student_test.status = 'completed'
    student_test.end_time = datetime.utcnow()
    student_test.score = total_score
    
    db.session.commit()
    
    return jsonify({
        'message': 'Test submitted successfully',
        'student_test': student_test.to_dict(),
        'score': total_score
    }), 200


@test_bp.route('/student-tests/<int:test_id>/answer-upload', methods=['POST'])
@jwt_required()
def upload_answer(test_id):
    """Upload a handwritten answer for a test question"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['student', 'supersub', 'assistant']:
        return jsonify({'message': 'Unauthorized. Student access required.'}), 403
    
    # Check if student is assigned to this test
    student_test = StudentTest.query.filter_by(student_id=current_user_id, test_id=test_id).first()
    
    if not student_test:
        return jsonify({'message': 'You are not assigned to this test'}), 404
    
    # Check if test is in progress
    if student_test.status != 'in_progress':
        return jsonify({'message': 'Test is not in progress'}), 400
    
    # Check if question_id is provided
    question_id = request.form.get('question_id')
    if not question_id:
        return jsonify({'message': 'Missing question_id'}), 400
    
    # Check if question exists and belongs to this test
    question = TestQuestion.query.get(question_id)
    if not question or question.test_id != test_id:
        return jsonify({'message': 'Invalid question_id'}), 400
    
    # Check if file is provided
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
    
    # Save file
    filename = secure_filename(f"{current_user_id}_{test_id}_{question_id}_{uuid.uuid4()}_{file.filename}")
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'test_answers')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    # Create or update answer
    answer = StudentAnswer.query.filter_by(
        student_test_id=student_test.id,
        question_id=question.id
    ).first()
    
    if not answer:
        answer = StudentAnswer(
            student_test_id=student_test.id,
            question_id=question.id,
            answer_file_path=file_path
        )
        db.session.add(answer)
    else:
        # Remove old file if exists
        if answer.answer_file_path and os.path.exists(answer.answer_file_path):
            os.remove(answer.answer_file_path)
        
        answer.answer_file_path = file_path
    
    db.session.commit()
    
    return jsonify({
        'message': 'Answer uploaded successfully',
        'file_path': file_path
    }), 200
