from datetime import datetime
from extensions import db

class Exam(db.Model):
    """Exam model representing formal examinations"""
    __tablename__ = 'exams'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    subject = db.Column(db.String(64), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    exam_date = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    student_exams = db.relationship('StudentExam', backref='exam', lazy='dynamic', cascade='all, delete-orphan')
    
    # Creator relationship
    creator = db.relationship('User', foreign_keys=[created_by], backref='created_exams')
    
    def to_dict(self):
        """Convert exam object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'subject': self.subject,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'exam_date': self.exam_date.isoformat() if self.exam_date else None,
            'duration_minutes': self.duration_minutes,
            'max_score': self.max_score,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<Exam {self.title}, Subject: {self.subject}>'


class StudentExam(db.Model):
    """Student exam model representing a student's participation in an exam"""
    __tablename__ = 'student_exams'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    answer_sheet_path = db.Column(db.String(256))  # Path to the uploaded answer sheet
    status = db.Column(db.String(20), default='pending')  # pending, submitted, evaluated, approved
    final_score = db.Column(db.Integer)  # Final score after evaluation
    display_score_type = db.Column(db.String(20))  # average, maximum
    is_approved = db.Column(db.Boolean, default=False)  # Whether the score is approved for display
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    evaluations = db.relationship('ExamEvaluation', backref='student_exam', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert student exam object to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'exam_id': self.exam_id,
            'answer_sheet_path': self.answer_sheet_path,
            'status': self.status,
            'final_score': self.final_score,
            'display_score_type': self.display_score_type,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<StudentExam {self.id}, Student: {self.student_id}, Exam: {self.exam_id}, Status: {self.status}>'


class ExamEvaluation(db.Model):
    """Exam evaluation model representing an evaluation of a student's exam by an evaluator"""
    __tablename__ = 'exam_evaluations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_exam_id = db.Column(db.Integer, db.ForeignKey('student_exams.id'), nullable=False)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text)
    handwriting_verified = db.Column(db.Boolean, default=False)  # Whether the handwriting was verified
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert exam evaluation object to dictionary"""
        return {
            'id': self.id,
            'student_exam_id': self.student_exam_id,
            'evaluator_id': self.evaluator_id,
            'score': self.score,
            'feedback': self.feedback,
            'handwriting_verified': self.handwriting_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<ExamEvaluation {self.id}, StudentExam: {self.student_exam_id}, Evaluator: {self.evaluator_id}>'
