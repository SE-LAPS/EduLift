from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from datetime import datetime

talent_identification_bp = Blueprint('talent_identification', __name__)

# Talent areas database with detailed information
TALENT_AREAS = {
    'STEM Innovation': {
        'description': 'Strong aptitude for Science, Technology, Engineering, and Mathematics with innovative thinking capabilities.',
        'primary_intelligences': ['Logical-Mathematical', 'Spatial-Visual'],
        'development_suggestions': [
            'Participate in science fairs and coding competitions',
            'Take advanced mathematics and programming courses',
            'Join robotics or engineering clubs',
            'Practice problem-solving with real-world applications'
        ],
        'career_opportunities': [
            'Software Engineer', 'Data Scientist', 'Research Scientist',
            'Biomedical Engineer', 'AI/ML Specialist', 'Product Manager'
        ],
        'learning_resources': [
            'Online coding platforms (HackerRank, LeetCode)',
            'MOOC courses in data science and AI',
            'Science journals and research papers',
            'Programming bootcamps and certifications'
        ]
    },
    'Creative Arts & Design': {
        'description': 'Exceptional creative abilities with strong visual and artistic intelligence.',
        'primary_intelligences': ['Spatial-Visual', 'Musical'],
        'development_suggestions': [
            'Develop a diverse portfolio of creative work',
            'Study different art movements and techniques',
            'Practice digital design tools and software',
            'Collaborate with other artists and designers'
        ],
        'career_opportunities': [
            'Graphic Designer', 'UX/UI Designer', 'Artist',
            'Animator', 'Music Producer', 'Creative Director'
        ],
        'learning_resources': [
            'Art and design courses (online and offline)',
            'Creative software tutorials (Adobe Creative Suite)',
            'Art history and theory books',
            'Design inspiration platforms (Behance, Dribbble)'
        ]
    },
    'Social Leadership': {
        'description': 'Natural leadership abilities combined with strong interpersonal and communication skills.',
        'primary_intelligences': ['Interpersonal', 'Linguistic'],
        'development_suggestions': [
            'Take on leadership roles in school or community',
            'Develop public speaking and presentation skills',
            'Study organizational psychology and management',
            'Practice conflict resolution and negotiation'
        ],
        'career_opportunities': [
            'Project Manager', 'Human Resources Manager', 'CEO/Executive',
            'Politician', 'Social Worker', 'Team Leader'
        ],
        'learning_resources': [
            'Leadership development programs',
            'Public speaking clubs (Toastmasters)',
            'Management and leadership books',
            'Mentorship opportunities with leaders'
        ]
    },
    'Analytical Research': {
        'description': 'Strong analytical thinking with excellent research and investigation capabilities.',
        'primary_intelligences': ['Logical-Mathematical', 'Intrapersonal'],
        'development_suggestions': [
            'Engage in research projects and academic studies',
            'Develop statistical analysis and data interpretation skills',
            'Practice critical thinking and hypothesis testing',
            'Write research papers and present findings'
        ],
        'career_opportunities': [
            'Research Scientist', 'Business Analyst', 'Market Researcher',
            'Policy Analyst', 'Consultant', 'Academic Researcher'
        ],
        'learning_resources': [
            'Research methodology courses',
            'Statistical software training (SPSS, R, Python)',
            'Academic journals in your field of interest',
            'Research internships and assistantships'
        ]
    },
    'Communication & Media': {
        'description': 'Exceptional communication skills with strong linguistic and interpersonal intelligence.',
        'primary_intelligences': ['Linguistic', 'Interpersonal'],
        'development_suggestions': [
            'Practice various forms of writing and speaking',
            'Study media production and journalism',
            'Build a portfolio of communication work',
            'Engage with diverse audiences and platforms'
        ],
        'career_opportunities': [
            'Journalist', 'Content Creator', 'Public Relations Specialist',
            'Marketing Manager', 'Teacher', 'Communications Director'
        ],
        'learning_resources': [
            'Journalism and media studies courses',
            'Writing workshops and seminars',
            'Media production software training',
            'Communication and rhetoric books'
        ]
    },
    'Physical & Athletic': {
        'description': 'Strong bodily-kinesthetic intelligence with excellent physical coordination and athletic abilities.',
        'primary_intelligences': ['Bodily-Kinesthetic', 'Interpersonal'],
        'development_suggestions': [
            'Train consistently in chosen sports or physical activities',
            'Study sports science and exercise physiology',
            'Develop coaching and mentoring skills',
            'Participate in competitive sports events'
        ],
        'career_opportunities': [
            'Professional Athlete', 'Sports Coach', 'Physical Therapist',
            'Fitness Trainer', 'Sports Commentator', 'Athletic Director'
        ],
        'learning_resources': [
            'Sports science and kinesiology courses',
            'Coaching certification programs',
            'Fitness and nutrition education',
            'Sports psychology resources'
        ]
    },
    'Environmental & Natural': {
        'description': 'Strong connection with nature and environmental patterns with naturalist intelligence.',
        'primary_intelligences': ['Naturalist', 'Logical-Mathematical'],
        'development_suggestions': [
            'Engage in outdoor activities and nature observation',
            'Study environmental science and conservation',
            'Participate in environmental protection projects',
            'Develop field research and data collection skills'
        ],
        'career_opportunities': [
            'Environmental Scientist', 'Marine Biologist', 'Park Ranger',
            'Sustainability Consultant', 'Wildlife Researcher', 'Ecologist'
        ],
        'learning_resources': [
            'Environmental science courses and field studies',
            'Nature guides and identification books',
            'Environmental research internships',
            'Conservation organization volunteering'
        ]
    },
    'Musical & Performing': {
        'description': 'Exceptional musical intelligence with strong performance and rhythm capabilities.',
        'primary_intelligences': ['Musical', 'Bodily-Kinesthetic'],
        'development_suggestions': [
            'Practice regularly with instruments or voice',
            'Study music theory and composition',
            'Perform in various settings and with different groups',
            'Explore different musical styles and genres'
        ],
        'career_opportunities': [
            'Musician', 'Music Teacher', 'Sound Engineer',
            'Music Producer', 'Composer', 'Music Therapist'
        ],
        'learning_resources': [
            'Music theory and composition courses',
            'Instrument lessons and masterclasses',
            'Music production software training',
            'Performance opportunities and auditions'
        ]
    }
}

def calculate_aptitude_scores(aptitude_results):
    """Calculate aptitude scores from test results"""
    aptitude_scores = {
        'logical': 0,
        'verbal': 0,
        'numerical': 0,
        'spatial': 0,
        'abstract': 0
    }
    
    type_counts = {
        'logical': 0,
        'verbal': 0,
        'numerical': 0,
        'spatial': 0,
        'abstract': 0
    }
    
    for result in aptitude_results:
        question_type = result.get('type', 'unknown')
        if question_type in aptitude_scores:
            aptitude_scores[question_type] += 1 if result.get('correct', False) else 0
            type_counts[question_type] += 1
    
    # Normalize scores to 0-1 range
    for aptitude_type in aptitude_scores:
        if type_counts[aptitude_type] > 0:
            aptitude_scores[aptitude_type] = aptitude_scores[aptitude_type] / type_counts[aptitude_type]
    
    return aptitude_scores

def calculate_intelligence_scores(intelligence_results):
    """Calculate multiple intelligence scores"""
    intelligence_scores = {}
    
    for intelligence in intelligence_results:
        intelligence_type = intelligence['type']
        score = intelligence['score']
        # Normalize to 0-1 range (assuming input is 1-5)
        normalized_score = (score - 1) / 4 if score > 0 else 0
        intelligence_scores[intelligence_type] = normalized_score
    
    return intelligence_scores

def calculate_preference_scores(personal_preferences):
    """Calculate preference scores by category"""
    preference_categories = {
        'STEM': ['Science & Technology', 'Research & Analysis'],
        'Creative': ['Arts & Creativity', 'Music & Performance'],
        'Physical': ['Sports & Athletics'],
        'Social': ['Social Work & Helping Others', 'Teaching & Education'],
        'Business': ['Business & Entrepreneurship'],
        'Leadership': ['Leadership & Management'],
        'Academic': ['Research & Analysis'],
        'Healthcare': ['Health & Medicine']
    }
    
    category_scores = {}
    
    for category, preferences in preference_categories.items():
        total_score = 0
        count = 0
        for pref in preferences:
            if pref in personal_preferences:
                total_score += personal_preferences[pref]
                count += 1
        
        if count > 0:
            # Normalize to 0-1 range (assuming input is 1-10)
            category_scores[category] = (total_score / count - 1) / 9
        else:
            category_scores[category] = 0
    
    return category_scores

def match_talents(aptitude_scores, intelligence_scores, preference_scores):
    """Match user profile with talent areas using ML algorithms"""
    recommendations = []
    
    for talent_area, details in TALENT_AREAS.items():
        strength_score = 0.0
        
        # Intelligence matching (50% weight)
        intelligence_weight = 0.5
        intelligence_match = 0.0
        primary_intelligences = details['primary_intelligences']
        
        for intelligence in primary_intelligences:
            if intelligence in intelligence_scores:
                intelligence_match += intelligence_scores[intelligence]
        
        if primary_intelligences:
            intelligence_match = intelligence_match / len(primary_intelligences)
        
        strength_score += intelligence_match * intelligence_weight
        
        # Aptitude matching (30% weight)
        aptitude_weight = 0.3
        aptitude_match = 0.0
        
        # Map talent areas to relevant aptitude types
        talent_aptitude_mapping = {
            'STEM Innovation': ['logical', 'numerical', 'abstract'],
            'Creative Arts & Design': ['spatial', 'abstract'],
            'Social Leadership': ['verbal'],
            'Analytical Research': ['logical', 'numerical'],
            'Communication & Media': ['verbal'],
            'Physical & Athletic': ['spatial'],
            'Environmental & Natural': ['logical', 'spatial'],
            'Musical & Performing': ['abstract', 'spatial']
        }
        
        relevant_aptitudes = talent_aptitude_mapping.get(talent_area, [])
        for aptitude in relevant_aptitudes:
            if aptitude in aptitude_scores:
                aptitude_match += aptitude_scores[aptitude]
        
        if relevant_aptitudes:
            aptitude_match = aptitude_match / len(relevant_aptitudes)
        
        strength_score += aptitude_match * aptitude_weight
        
        # Preference matching (20% weight)
        preference_weight = 0.2
        preference_match = 0.0
        
        # Map talent areas to preference categories
        talent_preference_mapping = {
            'STEM Innovation': ['STEM', 'Academic'],
            'Creative Arts & Design': ['Creative'],
            'Social Leadership': ['Social', 'Leadership'],
            'Analytical Research': ['Academic', 'STEM'],
            'Communication & Media': ['Social', 'Creative'],
            'Physical & Athletic': ['Physical'],
            'Environmental & Natural': ['STEM', 'Academic'],
            'Musical & Performing': ['Creative']
        }
        
        relevant_preferences = talent_preference_mapping.get(talent_area, [])
        for preference in relevant_preferences:
            if preference in preference_scores:
                preference_match += preference_scores[preference]
        
        if relevant_preferences:
            preference_match = preference_match / len(relevant_preferences)
        
        strength_score += preference_match * preference_weight
        
        # Convert to percentage and create recommendation
        strength_percentage = min(100, max(0, strength_score * 100))
        
        recommendation = {
            'talent_area': talent_area,
            'strength_percentage': round(strength_percentage, 1),
            'description': details['description'],
            'development_suggestions': details['development_suggestions'],
            'career_opportunities': details['career_opportunities'],
            'learning_resources': details['learning_resources'],
            'intelligence_types': details['primary_intelligences']
        }
        
        recommendations.append(recommendation)
    
    # Sort by strength percentage
    recommendations.sort(key=lambda x: x['strength_percentage'], reverse=True)
    
    return recommendations[:5]  # Return top 5 recommendations

@talent_identification_bp.route('/analyze', methods=['POST'])
def analyze_talent_profile():
    """Analyze user profile and provide talent recommendations"""
    try:
        data = request.get_json()
        
        # Extract data
        aptitude_results = data.get('aptitude_results', [])
        intelligence_results = data.get('intelligence_scores', [])
        personal_preferences = data.get('personal_preferences', {})
        
        # Calculate scores
        aptitude_scores = calculate_aptitude_scores(aptitude_results)
        intelligence_scores = calculate_intelligence_scores(intelligence_results)
        preference_scores = calculate_preference_scores(personal_preferences)
        
        # Generate talent recommendations
        recommendations = match_talents(aptitude_scores, intelligence_scores, preference_scores)
        
        # Store assessment result (optional - for future ML model training)
        assessment_data = {
            'timestamp': datetime.now().isoformat(),
            'aptitude_scores': aptitude_scores,
            'intelligence_scores': intelligence_scores,
            'preference_scores': preference_scores,
            'recommendations': recommendations
        }
        
        return jsonify({
            'success': True,
            'aptitude_scores': aptitude_scores,
            'intelligence_scores': intelligence_scores,
            'preference_scores': preference_scores,
            'recommendations': recommendations,
            'message': 'Talent analysis completed successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to analyze talent profile'
        }), 500

@talent_identification_bp.route('/talent-areas', methods=['GET'])
def get_talent_areas():
    """Get information about all talent areas"""
    try:
        talent_areas = []
        for area_name, details in TALENT_AREAS.items():
            area_info = {
                'name': area_name,
                'description': details['description'],
                'primary_intelligences': details['primary_intelligences'],
                'career_opportunities': details['career_opportunities']
            }
            talent_areas.append(area_info)
        
        return jsonify({
            'success': True,
            'talent_areas': talent_areas
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@talent_identification_bp.route('/aptitude-questions', methods=['GET'])
def get_aptitude_questions():
    """Get aptitude test questions"""
    try:
        # This would normally come from a database with a larger question pool
        questions = [
            {
                'id': '1',
                'question': 'If 3x + 7 = 22, what is the value of x?',
                'type': 'numerical',
                'options': ['3', '5', '7', '9'],
                'correct_answer': 1
            },
            {
                'id': '2',
                'question': 'Complete the pattern: 2, 6, 18, 54, ?',
                'type': 'logical',
                'options': ['108', '162', '216', '270'],
                'correct_answer': 1
            },
            {
                'id': '3',
                'question': 'Which word is most similar to "Abundant"?',
                'type': 'verbal',
                'options': ['Scarce', 'Plentiful', 'Limited', 'Rare'],
                'correct_answer': 1
            },
            {
                'id': '4',
                'question': 'How many small cubes are needed to build a 4x4x4 cube?',
                'type': 'spatial',
                'options': ['16', '32', '48', '64'],
                'correct_answer': 3
            },
            {
                'id': '5',
                'question': 'Which shape comes next in the sequence: ○, △, □, ○, △, ?',
                'type': 'abstract',
                'options': ['○', '△', '□', '◇'],
                'correct_answer': 2
            },
            {
                'id': '6',
                'question': 'If all Flippers are Gloops and some Gloops are Zingers, which statement must be true?',
                'type': 'logical',
                'options': [
                    'All Zingers are Flippers',
                    'Some Flippers are Zingers',
                    'All Flippers are Zingers',
                    'Some Zingers might be Flippers'
                ],
                'correct_answer': 3
            },
            {
                'id': '7',
                'question': 'Choose the word that best completes the analogy: Book : Page :: Tree : ?',
                'type': 'verbal',
                'options': ['Forest', 'Leaf', 'Branch', 'Root'],
                'correct_answer': 1
            },
            {
                'id': '8',
                'question': 'What is 15% of 240?',
                'type': 'numerical',
                'options': ['24', '30', '36', '40'],
                'correct_answer': 2
            },
            {
                'id': '9',
                'question': 'Which 3D shape can be formed by folding this 2D pattern? [Imagine a cross-shaped pattern]',
                'type': 'spatial',
                'options': ['Cube', 'Pyramid', 'Cylinder', 'Cone'],
                'correct_answer': 0
            },
            {
                'id': '10',
                'question': 'In the sequence 1, 1, 2, 3, 5, 8, 13, what is the next number?',
                'type': 'abstract',
                'options': ['18', '19', '20', '21'],
                'correct_answer': 3
            }
        ]
        
        return jsonify({
            'success': True,
            'questions': questions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@talent_identification_bp.route('/intelligence-types', methods=['GET'])
def get_intelligence_types():
    """Get multiple intelligence types and their descriptions"""
    try:
        intelligence_types = [
            {
                'type': 'Linguistic',
                'description': 'Understanding and using language effectively',
                'characteristics': ['Good with words', 'Enjoys reading and writing', 'Strong verbal communication']
            },
            {
                'type': 'Logical-Mathematical',
                'description': 'Working with numbers, patterns, and logical reasoning',
                'characteristics': ['Enjoys math and logic puzzles', 'Good at pattern recognition', 'Analytical thinking']
            },
            {
                'type': 'Spatial-Visual',
                'description': 'Understanding visual and spatial information',
                'characteristics': ['Good spatial awareness', 'Enjoys visual arts', 'Can visualize in 3D']
            },
            {
                'type': 'Musical',
                'description': 'Understanding and creating music',
                'characteristics': ['Good sense of rhythm', 'Enjoys music', 'Can recognize musical patterns']
            },
            {
                'type': 'Bodily-Kinesthetic',
                'description': 'Using physical movement and coordination',
                'characteristics': ['Good coordination', 'Learns through movement', 'Enjoys physical activities']
            },
            {
                'type': 'Interpersonal',
                'description': 'Understanding and working with others',
                'characteristics': ['Good with people', 'Empathetic', 'Natural leader or team player']
            },
            {
                'type': 'Intrapersonal',
                'description': 'Understanding yourself and self-reflection',
                'characteristics': ['Self-aware', 'Reflective', 'Good at goal setting']
            },
            {
                'type': 'Naturalist',
                'description': 'Understanding nature and environmental patterns',
                'characteristics': ['Connects with nature', 'Good at categorizing', 'Environmental awareness']
            }
        ]
        
        return jsonify({
            'success': True,
            'intelligence_types': intelligence_types
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 