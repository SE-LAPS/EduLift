from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """User model representing all users in the system"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')  # admin, teacher, assistant, supersub, student
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student_tests = db.relationship('StudentTest', backref='student', lazy='dynamic', 
                                   foreign_keys='StudentTest.student_id', cascade='all, delete-orphan')
    student_exams = db.relationship('StudentExam', backref='student', lazy='dynamic',
                                   foreign_keys='StudentExam.student_id', cascade='all, delete-orphan')
    evaluations = db.relationship('ExamEvaluation', backref='evaluator', lazy='dynamic',
                                 foreign_keys='ExamEvaluation.evaluator_id', cascade='all, delete-orphan')
    handwriting_samples = db.relationship('HandwritingSample', backref='student', lazy='dynamic',
                                         foreign_keys='HandwritingSample.student_id', cascade='all, delete-orphan')
    
    def __init__(self, username, email, password, first_name, last_name, role='student'):
        self.username = username
        self.email = email
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
    
    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.username}, Role: {self.role}>'
