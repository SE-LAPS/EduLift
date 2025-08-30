from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os
from datetime import datetime

career_guidance_bp = Blueprint('career_guidance', __name__)

# Career database with detailed information
CAREER_DATABASE = {
    'Software Engineer': {
        'description': 'Design, develop, and maintain software applications and systems using various programming languages and technologies.',
        'required_skills': ['Programming', 'Problem Solving', 'Logical Thinking', 'Mathematics', 'Communication'],
        'personality_traits': ['Openness', 'Conscientiousness'],
        'salary_range': 'LKR 800,000 - 2,500,000 annually',
        'growth_prospects': 'High demand with excellent career progression opportunities in tech industry',
        'education_path': [
            'Computer Science or Software Engineering degree',
            'Programming bootcamps and certifications',
            'Continuous learning in new technologies'
        ],
        'personality_fit': 'Best suited for logical, detail-oriented individuals who enjoy problem-solving'
    },
    'Data Scientist': {
        'description': 'Analyze complex data to extract insights and build predictive models that drive business decisions.',
        'required_skills': ['Statistics', 'Programming', 'Data Analysis', 'Machine Learning', 'Mathematics'],
        'personality_traits': ['Openness', 'Conscientiousness'],
        'salary_range': 'LKR 1,000,000 - 3,000,000 annually',
        'growth_prospects': 'Very high demand with emerging opportunities in AI and machine learning',
        'education_path': [
            'Statistics, Mathematics, or Computer Science degree',
            'Data science specialization courses',
            'Machine learning and AI certifications'
        ],
        'personality_fit': 'Ideal for analytical minds who enjoy working with numbers and patterns'
    },
    'Marketing Manager': {
        'description': 'Develop and execute marketing strategies to promote products or services and drive business growth.',
        'required_skills': ['Communication', 'Creativity', 'Strategic Thinking', 'Social Media', 'Analytics'],
        'personality_traits': ['Extraversion', 'Openness'],
        'salary_range': 'LKR 600,000 - 2,000,000 annually',
        'growth_prospects': 'Good opportunities with digital marketing expansion',
        'education_path': [
            'Marketing, Business Administration, or Communications degree',
            'Digital marketing certifications',
            'Brand management training'
        ],
        'personality_fit': 'Perfect for creative, outgoing individuals who understand consumer behavior'
    },
    'Doctor': {
        'description': 'Diagnose and treat illnesses, injuries, and medical conditions to improve patient health and well-being.',
        'required_skills': ['Medical Knowledge', 'Empathy', 'Communication', 'Problem Solving', 'Attention to Detail'],
        'personality_traits': ['Agreeableness', 'Conscientiousness'],
        'salary_range': 'LKR 1,200,000 - 4,000,000 annually',
        'growth_prospects': 'Stable and highly respected profession with specialization opportunities',
        'education_path': [
            'Medical degree (MBBS)',
            'Medical residency and specialization',
            'Continuous medical education'
        ],
        'personality_fit': 'Suited for compassionate, dedicated individuals who want to help others'
    },
    'Teacher': {
        'description': 'Educate and mentor students, creating engaging learning experiences and fostering academic growth.',
        'required_skills': ['Communication', 'Patience', 'Subject Expertise', 'Leadership', 'Empathy'],
        'personality_traits': ['Agreeableness', 'Extraversion'],
        'salary_range': 'LKR 400,000 - 1,200,000 annually',
        'growth_prospects': 'Stable with opportunities for advancement to administrative roles',
        'education_path': [
            'Education degree or subject-specific degree',
            'Teaching certification',
            'Professional development courses'
        ],
        'personality_fit': 'Best for patient, communicative people who enjoy helping others learn'
    },
    'Engineer': {
        'description': 'Apply scientific and mathematical principles to design, build, and maintain structures, machines, or systems.',
        'required_skills': ['Mathematics', 'Problem Solving', 'Technical Drawing', 'Physics', 'Project Management'],
        'personality_traits': ['Conscientiousness', 'Openness'],
        'salary_range': 'LKR 700,000 - 2,200,000 annually',
        'growth_prospects': 'Good demand in construction, manufacturing, and infrastructure development',
        'education_path': [
            'Engineering degree in relevant field',
            'Professional engineering certification',
            'Specialized technical training'
        ],
        'personality_fit': 'Ideal for logical, methodical individuals who enjoy solving technical challenges'
    },
    'Artist/Designer': {
        'description': 'Create visual content, artwork, or designs for various media including digital, print, and interactive platforms.',
        'required_skills': ['Creativity', 'Artistic Skills', 'Design Software', 'Visual Communication', 'Attention to Detail'],
        'personality_traits': ['Openness', 'Extraversion'],
        'salary_range': 'LKR 300,000 - 1,500,000 annually',
        'growth_prospects': 'Growing opportunities in digital media and user experience design',
        'education_path': [
            'Fine Arts, Graphic Design, or related degree',
            'Portfolio development',
            'Digital design tool certifications'
        ],
        'personality_fit': 'Perfect for creative, imaginative individuals with strong visual sense'
    },
    'Business Analyst': {
        'description': 'Analyze business processes and systems to identify improvements and drive organizational efficiency.',
        'required_skills': ['Analytics', 'Communication', 'Problem Solving', 'Business Acumen', 'Project Management'],
        'personality_traits': ['Conscientiousness', 'Openness'],
        'salary_range': 'LKR 800,000 - 2,000,000 annually',
        'growth_prospects': 'High demand with opportunities for specialization in various industries',
        'education_path': [
            'Business Administration, Economics, or related degree',
            'Business analysis certifications',
            'Industry-specific training'
        ],
        'personality_fit': 'Suited for analytical, detail-oriented professionals who understand business operations'
    },
    'Counselor/Psychologist': {
        'description': 'Provide mental health support, therapy, and guidance to help individuals overcome challenges and improve well-being.',
        'required_skills': ['Empathy', 'Communication', 'Active Listening', 'Psychology Knowledge', 'Patience'],
        'personality_traits': ['Agreeableness', 'Openness'],
        'salary_range': 'LKR 500,000 - 1,800,000 annually',
        'growth_prospects': 'Growing awareness of mental health increasing demand for professionals',
        'education_path': [
            'Psychology degree',
            'Counseling or clinical psychology specialization',
            'Licensed practice certification'
        ],
        'personality_fit': 'Best for empathetic, patient individuals who want to help others emotionally'
    },
    'Entrepreneur': {
        'description': 'Start and manage businesses, identifying opportunities and taking calculated risks to create value.',
        'required_skills': ['Leadership', 'Risk Taking', 'Business Planning', 'Communication', 'Innovation'],
        'personality_traits': ['Extraversion', 'Openness'],
        'salary_range': 'Variable - depends on business success',
        'growth_prospects': 'Unlimited potential with high risk-reward ratio',
        'education_path': [
            'Business, Economics, or relevant field degree',
            'Entrepreneurship programs',
            'Industry-specific knowledge and networking'
        ],
        'personality_fit': 'Ideal for risk-taking, innovative leaders who want to create their own path'
    }
}

def calculate_personality_scores(answers):
    """Calculate Big Five personality scores from questionnaire answers"""
    personality_scores = {
        'Openness': 0,
        'Conscientiousness': 0,
        'Extraversion': 0,
        'Agreeableness': 0,
        'Neuroticism': 0
    }
    
    # Map questions to personality traits
    question_mapping = {
        '1': 'Openness', '2': 'Conscientiousness', '3': 'Extraversion',
        '4': 'Agreeableness', '5': 'Neuroticism', '6': 'Openness',
        '7': 'Conscientiousness', '8': 'Extraversion', '9': 'Agreeableness',
        '10': 'Neuroticism'
    }
    
    for question_id, score in answers.items():
        trait = question_mapping.get(question_id)
        if trait:
            # Reverse score for neuroticism question 10 (remaining calm)
            if question_id == '10':
                score = 6 - score
            personality_scores[trait] += score
    
    # Normalize scores (each trait has 2 questions, max score 10)
    for trait in personality_scores:
        personality_scores[trait] = personality_scores[trait] / 10.0
    
    return personality_scores

def calculate_skill_scores(skills):
    """Calculate skill category scores"""
    skill_scores = {
        'Technical': 0,
        'Creative': 0,
        'Analytical': 0,
        'Social': 0,
        'Leadership': 0
    }
    
    category_counts = {
        'Technical': 0,
        'Creative': 0,
        'Analytical': 0,
        'Social': 0,
        'Leadership': 0
    }
    
    for skill in skills:
        category = skill['category']
        skill_scores[category] += skill['level']
        category_counts[category] += 1
    
    # Calculate average scores
    for category in skill_scores:
        if category_counts[category] > 0:
            skill_scores[category] = skill_scores[category] / category_counts[category] / 5.0
    
    return skill_scores

def match_careers(personality_scores, skill_scores, interests):
    """Match user profile with career recommendations using AI algorithm"""
    recommendations = []
    
    for career, details in CAREER_DATABASE.items():
        match_score = 0.0
        
        # Personality matching (40% weight)
        personality_weight = 0.4
        personality_match = 0.0
        for trait in details['personality_traits']:
            if trait in personality_scores:
                personality_match += personality_scores[trait]
        personality_match = personality_match / len(details['personality_traits']) if details['personality_traits'] else 0
        match_score += personality_match * personality_weight
        
        # Skills matching (40% weight)
        skills_weight = 0.4
        skills_match = 0.0
        skill_mapping = {
            'Programming': 'Technical',
            'Problem Solving': 'Analytical',
            'Logical Thinking': 'Analytical',
            'Mathematics': 'Analytical',
            'Communication': 'Social',
            'Statistics': 'Analytical',
            'Data Analysis': 'Technical',
            'Machine Learning': 'Technical',
            'Creativity': 'Creative',
            'Strategic Thinking': 'Analytical',
            'Social Media': 'Social',
            'Analytics': 'Analytical',
            'Medical Knowledge': 'Technical',
            'Empathy': 'Social',
            'Attention to Detail': 'Analytical',
            'Patience': 'Social',
            'Subject Expertise': 'Technical',
            'Leadership': 'Leadership',
            'Technical Drawing': 'Technical',
            'Physics': 'Analytical',
            'Project Management': 'Leadership',
            'Artistic Skills': 'Creative',
            'Design Software': 'Technical',
            'Visual Communication': 'Creative',
            'Business Acumen': 'Analytical',
            'Active Listening': 'Social',
            'Psychology Knowledge': 'Technical',
            'Risk Taking': 'Leadership',
            'Business Planning': 'Leadership',
            'Innovation': 'Creative'
        }
        
        for required_skill in details['required_skills']:
            category = skill_mapping.get(required_skill, 'Technical')
            if category in skill_scores:
                skills_match += skill_scores[category]
        skills_match = skills_match / len(details['required_skills']) if details['required_skills'] else 0
        match_score += skills_match * skills_weight
        
        # Interest matching (20% weight)
        interests_weight = 0.2
        interest_match = 0.0
        career_interests = {
            'Software Engineer': ['Technology'],
            'Data Scientist': ['Technology', 'Science'],
            'Marketing Manager': ['Business', 'Media'],
            'Doctor': ['Healthcare', 'Science'],
            'Teacher': ['Education'],
            'Engineer': ['Technology', 'Science'],
            'Artist/Designer': ['Arts', 'Media'],
            'Business Analyst': ['Business', 'Technology'],
            'Counselor/Psychologist': ['Healthcare', 'Social Work'],
            'Entrepreneur': ['Business']
        }
        
        career_interest_list = career_interests.get(career, [])
        common_interests = set(interests) & set(career_interest_list)
        if career_interest_list:
            interest_match = len(common_interests) / len(career_interest_list)
        match_score += interest_match * interests_weight
        
        # Convert to percentage and create recommendation
        match_percentage = min(100, max(0, match_score * 100))
        
        # Generate personality fit explanation
        dominant_traits = [trait for trait, score in personality_scores.items() if score > 0.6]
        personality_fit = details['personality_fit']
        if dominant_traits:
            personality_fit += f" Your strong {', '.join(dominant_traits).lower()} traits align well with this role."
        
        recommendation = {
            'title': career,
            'match_percentage': round(match_percentage, 1),
            'description': details['description'],
            'required_skills': details['required_skills'],
            'salary_range': details['salary_range'],
            'growth_prospects': details['growth_prospects'],
            'education_path': details['education_path'],
            'personality_fit': personality_fit
        }
        
        recommendations.append(recommendation)
    
    # Sort by match percentage
    recommendations.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    return recommendations[:5]  # Return top 5 recommendations

@career_guidance_bp.route('/analyze', methods=['POST'])
def analyze_career_profile():
    """Analyze user profile and provide career recommendations"""
    try:
        data = request.get_json()
        
        # Extract data
        personal_info = data.get('personal_info', {})
        personality_answers = data.get('personality_scores', {})
        skills = data.get('skills', [])
        
        # Calculate personality scores
        personality_scores = calculate_personality_scores(personality_answers)
        
        # Calculate skill scores
        skill_scores = calculate_skill_scores(skills)
        
        # Get interests
        interests = personal_info.get('interests', [])
        
        # Generate career recommendations
        recommendations = match_careers(personality_scores, skill_scores, interests)
        
        # Store assessment result (optional - for future ML model training)
        assessment_data = {
            'timestamp': datetime.now().isoformat(),
            'personality_scores': personality_scores,
            'skill_scores': skill_scores,
            'interests': interests,
            'education_level': personal_info.get('education_level'),
            'age': personal_info.get('age'),
            'recommendations': recommendations
        }
        
        return jsonify({
            'success': True,
            'personality_scores': personality_scores,
            'skill_scores': skill_scores,
            'recommendations': recommendations,
            'message': 'Career analysis completed successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to analyze career profile'
        }), 500

@career_guidance_bp.route('/careers', methods=['GET'])
def get_all_careers():
    """Get information about all available careers"""
    try:
        careers = []
        for career_name, details in CAREER_DATABASE.items():
            career_info = {
                'title': career_name,
                'description': details['description'],
                'required_skills': details['required_skills'],
                'salary_range': details['salary_range'],
                'growth_prospects': details['growth_prospects'],
                'education_path': details['education_path']
            }
            careers.append(career_info)
        
        return jsonify({
            'success': True,
            'careers': careers
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@career_guidance_bp.route('/skills', methods=['GET'])
def get_skill_categories():
    """Get available skill categories"""
    try:
        skill_categories = [
            {'name': 'Mathematics & Logic', 'category': 'Analytical'},
            {'name': 'Communication', 'category': 'Social'},
            {'name': 'Creative Writing', 'category': 'Creative'},
            {'name': 'Problem Solving', 'category': 'Analytical'},
            {'name': 'Leadership', 'category': 'Leadership'},
            {'name': 'Programming/Technology', 'category': 'Technical'},
            {'name': 'Art & Design', 'category': 'Creative'},
            {'name': 'Public Speaking', 'category': 'Social'},
            {'name': 'Team Management', 'category': 'Leadership'},
            {'name': 'Data Analysis', 'category': 'Technical'}
        ]
        
        return jsonify({
            'success': True,
            'skill_categories': skill_categories
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 