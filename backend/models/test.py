from datetime import datetime
from extensions import db

class Test(db.Model):
    """Test model representing assessments created by teachers"""
    __tablename__ = 'tests'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(64), nullable=False)
    concept = db.Column(db.String(64), nullable=False)  # The specific concept being tested
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    questions = db.relationship('TestQuestion', backref='test', lazy='dynamic', cascade='all, delete-orphan')
    student_tests = db.relationship('StudentTest', backref='test', lazy='dynamic', cascade='all, delete-orphan')
    
    # Creator relationship
    creator = db.relationship('User', foreign_keys=[created_by], backref='created_tests')
    
    def to_dict(self):
        """Convert test object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'subject': self.subject,
            'concept': self.concept,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration_minutes': self.duration_minutes,
            'max_score': self.max_score,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<Test {self.title}, Subject: {self.subject}, Concept: {self.concept}>'


class TestQuestion(db.Model):
    """Test question model representing questions in a test"""
    __tablename__ = 'test_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(20), nullable=False)  # mcq, short_answer, essay
    points = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    options = db.relationship('TestQuestionOption', backref='question', lazy='dynamic', cascade='all, delete-orphan')
    answers = db.relationship('StudentAnswer', backref='question', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert test question object to dictionary"""
        return {
            'id': self.id,
            'test_id': self.test_id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'points': self.points,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'options': [option.to_dict() for option in self.options]
        }
    
    def __repr__(self):
        return f'<TestQuestion {self.id}, Type: {self.question_type}>'


class TestQuestionOption(db.Model):
    """Test question option model representing options for MCQ questions"""
    __tablename__ = 'test_question_options'
    
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('test_questions.id'), nullable=False)
    option_text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert test question option object to dictionary"""
        return {
            'id': self.id,
            'question_id': self.question_id,
            'option_text': self.option_text,
            'is_correct': self.is_correct,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<TestQuestionOption {self.id}, Correct: {self.is_correct}>'


class StudentTest(db.Model):
    """Student test model representing a student's participation in a test"""
    __tablename__ = 'student_tests'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    score = db.Column(db.Integer)
    status = db.Column(db.String(20), default='not_started')  # not_started, in_progress, completed, evaluated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    answers = db.relationship('StudentAnswer', backref='student_test', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert student test object to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'test_id': self.test_id,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'score': self.score,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<StudentTest {self.id}, Student: {self.student_id}, Test: {self.test_id}, Status: {self.status}>'


class StudentAnswer(db.Model):
    """Student answer model representing a student's answer to a test question"""
    __tablename__ = 'student_answers'
    
    id = db.Column(db.Integer, primary_key=True)
    student_test_id = db.Column(db.Integer, db.ForeignKey('student_tests.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('test_questions.id'), nullable=False)
    answer_text = db.Column(db.Text)
    selected_option_id = db.Column(db.Integer, db.ForeignKey('test_question_options.id'))
    answer_file_path = db.Column(db.String(256))  # For uploaded handwritten answers
    score = db.Column(db.Integer)
    is_correct = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    selected_option = db.relationship('TestQuestionOption', foreign_keys=[selected_option_id])
    
    def to_dict(self):
        """Convert student answer object to dictionary"""
        return {
            'id': self.id,
            'student_test_id': self.student_test_id,
            'question_id': self.question_id,
            'answer_text': self.answer_text,
            'selected_option_id': self.selected_option_id,
            'answer_file_path': self.answer_file_path,
            'score': self.score,
            'is_correct': self.is_correct,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<StudentAnswer {self.id}, StudentTest: {self.student_test_id}, Question: {self.question_id}>'
