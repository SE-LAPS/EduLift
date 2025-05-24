from datetime import datetime
from extensions import db

class HandwritingSample(db.Model):
    """Handwriting sample model for storing student handwriting samples"""
    __tablename__ = 'handwriting_samples'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sample_path = db.Column(db.String(256), nullable=False)  # Path to the handwriting sample image
    sample_type = db.Column(db.String(20), nullable=False)  # training, verification
    is_verified = db.Column(db.Boolean, default=False)  # Whether the sample has been verified
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert handwriting sample object to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'sample_path': self.sample_path,
            'sample_type': self.sample_type,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<HandwritingSample {self.id}, Student: {self.student_id}, Type: {self.sample_type}>'


class HandwritingModel(db.Model):
    """Handwriting model for storing trained CNN models"""
    __tablename__ = 'handwriting_models'
    
    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(128), nullable=False)
    model_path = db.Column(db.String(256), nullable=False)  # Path to the saved model
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    accuracy = db.Column(db.Float)  # Model accuracy
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Creator relationship
    creator = db.relationship('User', foreign_keys=[created_by], backref='created_models')
    
    def to_dict(self):
        """Convert handwriting model object to dictionary"""
        return {
            'id': self.id,
            'model_name': self.model_name,
            'model_path': self.model_path,
            'created_by': self.created_by,
            'accuracy': self.accuracy,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<HandwritingModel {self.model_name}, Accuracy: {self.accuracy}>'
