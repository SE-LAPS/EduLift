from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import random
import uuid
import json
from datetime import datetime, timedelta

test_management_bp = Blueprint('test_management', __name__)

# In-memory storage (in production, this would be a database)
TESTS = []
QUESTIONS = []
TEST_RESULTS = []

# Sample test results for demonstration
SAMPLE_TEST_RESULTS = [
    {
        'test_id': None,  # Will be set when tests are initialized
        'student_name': 'Alice Johnson',
        'score': 85,
        'total_points': 100,
        'completion_time': 28,
        'adaptive_performance': {
            'difficulty_progression': ['easy', 'medium', 'hard'],
            'accuracy_rate': 0.85,
            'learning_insights': ['Strong in fundamentals', 'Needs practice in advanced concepts']
        },
        'date_taken': (datetime.now() - timedelta(days=2)).isoformat()
    },
    {
        'test_id': None,
        'student_name': 'Bob Smith',
        'score': 72,
        'total_points': 100,
        'completion_time': 35,
        'adaptive_performance': {
            'difficulty_progression': ['easy', 'medium', 'medium'],
            'accuracy_rate': 0.72,
            'learning_insights': ['Good analytical skills', 'Review basic concepts']
        },
        'date_taken': (datetime.now() - timedelta(days=1)).isoformat()
    },
    {
        'test_id': None,
        'student_name': 'Carol Williams',
        'score': 94,
        'total_points': 100,
        'completion_time': 25,
        'adaptive_performance': {
            'difficulty_progression': ['medium', 'hard', 'hard'],
            'accuracy_rate': 0.94,
            'learning_insights': ['Exceptional performance', 'Ready for advanced challenges']
        },
        'date_taken': datetime.now().isoformat()
    },
    {
        'test_id': None,
        'student_name': 'David Brown',
        'score': 78,
        'total_points': 100,
        'completion_time': 42,
        'adaptive_performance': {
            'difficulty_progression': ['easy', 'medium', 'medium'],
            'accuracy_rate': 0.78,
            'learning_insights': ['Solid understanding', 'Work on time management']
        },
        'date_taken': (datetime.now() - timedelta(hours=5)).isoformat()
    },
    {
        'test_id': None,
        'student_name': 'Eva Davis',
        'score': 88,
        'total_points': 100,
        'completion_time': 30,
        'adaptive_performance': {
            'difficulty_progression': ['medium', 'hard', 'hard'],
            'accuracy_rate': 0.88,
            'learning_insights': ['Strong problem-solving skills', 'Excellent progress']
        },
        'date_taken': (datetime.now() - timedelta(hours=8)).isoformat()
    },
    {
        'test_id': None,
        'student_name': 'Frank Miller',
        'score': 76,
        'total_points': 100,
        'completion_time': 32,
        'adaptive_performance': {
            'difficulty_progression': ['easy', 'medium', 'medium'],
            'accuracy_rate': 0.76,
            'learning_insights': ['Good grasp of concepts', 'Focus on detail improvement']
        },
        'date_taken': (datetime.now() - timedelta(hours=3)).isoformat()
    }
]

# Sample questions for demonstration
SAMPLE_QUESTIONS = [
    # Information Technology
    {
        'id': str(uuid.uuid4()),
        'question': 'What does HTML stand for?',
        'type': 'multiple_choice',
        'options': ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        'correct_answer': 'Hyper Text Markup Language',
        'difficulty': 'easy',
        'subject': 'Information Technology',
        'topic': 'Web Development',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which protocol is used for secure data transmission over the internet?',
        'type': 'multiple_choice',
        'options': ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
        'correct_answer': 'HTTPS',
        'difficulty': 'medium',
        'subject': 'Information Technology',
        'topic': 'Network Security',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the main purpose of an operating system?',
        'type': 'multiple_choice',
        'options': ['To run applications', 'To manage hardware resources', 'To provide user interface', 'All of the above'],
        'correct_answer': 'All of the above',
        'difficulty': 'medium',
        'subject': 'Information Technology',
        'topic': 'Operating Systems',
        'points': 2
    },
    # Artificial Intelligence
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the primary goal of artificial intelligence?',
        'type': 'multiple_choice',
        'options': ['To replace humans', 'To simulate human intelligence', 'To create robots', 'To process data faster'],
        'correct_answer': 'To simulate human intelligence',
        'difficulty': 'easy',
        'subject': 'Artificial Intelligence',
        'topic': 'AI Fundamentals',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which algorithm is commonly used for decision-making in AI?',
        'type': 'multiple_choice',
        'options': ['Linear Search', 'Decision Tree', 'Bubble Sort', 'Binary Search'],
        'correct_answer': 'Decision Tree',
        'difficulty': 'medium',
        'subject': 'Artificial Intelligence',
        'topic': 'AI Algorithms',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What does NLP stand for in AI?',
        'type': 'multiple_choice',
        'options': ['Natural Language Processing', 'Neural Language Programming', 'Network Learning Protocol', 'New Learning Process'],
        'correct_answer': 'Natural Language Processing',
        'difficulty': 'medium',
        'subject': 'Artificial Intelligence',
        'topic': 'Natural Language Processing',
        'points': 2
    },
    # Machine Learning
    {
        'id': str(uuid.uuid4()),
        'question': 'What are the three main types of machine learning?',
        'type': 'multiple_choice',
        'options': ['Supervised, Unsupervised, Reinforcement', 'Linear, Non-linear, Deep', 'Classification, Regression, Clustering', 'Training, Testing, Validation'],
        'correct_answer': 'Supervised, Unsupervised, Reinforcement',
        'difficulty': 'medium',
        'subject': 'Machine Learning',
        'topic': 'ML Types',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which algorithm is used for linear regression?',
        'type': 'multiple_choice',
        'options': ['K-Means', 'Decision Tree', 'Gradient Descent', 'Random Forest'],
        'correct_answer': 'Gradient Descent',
        'difficulty': 'hard',
        'subject': 'Machine Learning',
        'topic': 'Regression',
        'points': 3
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is overfitting in machine learning?',
        'type': 'multiple_choice',
        'options': ['Model performs well on training data but poorly on test data', 'Model performs poorly on both training and test data', 'Model takes too long to train', 'Model uses too much memory'],
        'correct_answer': 'Model performs well on training data but poorly on test data',
        'difficulty': 'medium',
        'subject': 'Machine Learning',
        'topic': 'Model Evaluation',
        'points': 2
    },
    # IQ Test
    {
        'id': str(uuid.uuid4()),
        'question': 'What comes next in the sequence: 2, 4, 8, 16, ?',
        'type': 'multiple_choice',
        'options': ['24', '32', '20', '18'],
        'correct_answer': '32',
        'difficulty': 'easy',
        'subject': 'IQ Test',
        'topic': 'Pattern Recognition',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles.',
        'type': 'true_false',
        'options': None,
        'correct_answer': 'true',
        'difficulty': 'medium',
        'subject': 'IQ Test',
        'topic': 'Logical Reasoning',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which word does not belong: Apple, Orange, Banana, Carrot?',
        'type': 'multiple_choice',
        'options': ['Apple', 'Orange', 'Banana', 'Carrot'],
        'correct_answer': 'Carrot',
        'difficulty': 'easy',
        'subject': 'IQ Test',
        'topic': 'Classification',
        'points': 1
    },
    # Science Test
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the process by which plants make their own food?',
        'type': 'multiple_choice',
        'options': ['Respiration', 'Photosynthesis', 'Digestion', 'Excretion'],
        'correct_answer': 'Photosynthesis',
        'difficulty': 'easy',
        'subject': 'Science Test',
        'topic': 'Biology',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the chemical symbol for water?',
        'type': 'multiple_choice',
        'options': ['H2O', 'CO2', 'NaCl', 'CH4'],
        'correct_answer': 'H2O',
        'difficulty': 'easy',
        'subject': 'Science Test',
        'topic': 'Chemistry',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What force keeps planets in orbit around the sun?',
        'type': 'multiple_choice',
        'options': ['Magnetic force', 'Gravitational force', 'Electric force', 'Nuclear force'],
        'correct_answer': 'Gravitational force',
        'difficulty': 'medium',
        'subject': 'Science Test',
        'topic': 'Physics',
        'points': 2
    },
    # Statistics
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the mean of the numbers: 2, 4, 6, 8, 10?',
        'type': 'multiple_choice',
        'options': ['5', '6', '7', '8'],
        'correct_answer': '6',
        'difficulty': 'easy',
        'subject': 'Statistics',
        'topic': 'Descriptive Statistics',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the median of: 1, 3, 3, 6, 7, 8, 9?',
        'type': 'multiple_choice',
        'options': ['3', '6', '7', '5.28'],
        'correct_answer': '6',
        'difficulty': 'medium',
        'subject': 'Statistics',
        'topic': 'Central Tendency',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What does a correlation coefficient of -1 indicate?',
        'type': 'multiple_choice',
        'options': ['Perfect positive correlation', 'Perfect negative correlation', 'No correlation', 'Weak correlation'],
        'correct_answer': 'Perfect negative correlation',
        'difficulty': 'hard',
        'subject': 'Statistics',
        'topic': 'Correlation',
        'points': 3
    },
    # Mathematics
    {
        'id': str(uuid.uuid4()),
        'question': 'Solve for x: 2x + 5 = 13',
        'type': 'multiple_choice',
        'options': ['3', '4', '5', '6'],
        'correct_answer': '4',
        'difficulty': 'medium',
        'subject': 'Mathematics',
        'topic': 'Algebra',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Calculate the area of a circle with radius 5 units. (Use π = 3.14)',
        'type': 'short_answer',
        'options': None,
        'correct_answer': '78.5',
        'difficulty': 'medium',
        'subject': 'Mathematics',
        'topic': 'Geometry',
        'points': 3
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'If f(x) = 3x² + 2x - 1, what is f(2)?',
        'type': 'multiple_choice',
        'options': ['13', '15', '17', '19'],
        'correct_answer': '15',
        'difficulty': 'hard',
        'subject': 'Mathematics',
        'topic': 'Functions',
        'points': 3
    },
    # Network
    {
        'id': str(uuid.uuid4()),
        'question': 'What does IP stand for in networking?',
        'type': 'multiple_choice',
        'options': ['Internet Protocol', 'Internal Process', 'Information Package', 'Integrated Platform'],
        'correct_answer': 'Internet Protocol',
        'difficulty': 'easy',
        'subject': 'Network',
        'topic': 'Network Protocols',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which OSI layer is responsible for routing?',
        'type': 'multiple_choice',
        'options': ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        'correct_answer': 'Network Layer',
        'difficulty': 'medium',
        'subject': 'Network',
        'topic': 'OSI Model',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the default subnet mask for a Class C network?',
        'type': 'multiple_choice',
        'options': ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
        'correct_answer': '255.255.255.0',
        'difficulty': 'hard',
        'subject': 'Network',
        'topic': 'Subnetting',
        'points': 3
    },
    # Music
    {
        'id': str(uuid.uuid4()),
        'question': 'How many lines does a musical staff have?',
        'type': 'multiple_choice',
        'options': ['4', '5', '6', '7'],
        'correct_answer': '5',
        'difficulty': 'easy',
        'subject': 'Music',
        'topic': 'Music Theory',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the time signature of a waltz?',
        'type': 'multiple_choice',
        'options': ['2/4', '3/4', '4/4', '6/8'],
        'correct_answer': '3/4',
        'difficulty': 'medium',
        'subject': 'Music',
        'topic': 'Rhythm',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Who composed "The Four Seasons"?',
        'type': 'multiple_choice',
        'options': ['Bach', 'Mozart', 'Vivaldi', 'Beethoven'],
        'correct_answer': 'Vivaldi',
        'difficulty': 'medium',
        'subject': 'Music',
        'topic': 'Classical Music',
        'points': 2
    },
    # Commerce
    {
        'id': str(uuid.uuid4()),
        'question': 'What does GDP stand for?',
        'type': 'multiple_choice',
        'options': ['Gross Domestic Product', 'General Development Plan', 'Global Distribution Process', 'Government Development Policy'],
        'correct_answer': 'Gross Domestic Product',
        'difficulty': 'easy',
        'subject': 'Commerce',
        'topic': 'Economics',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the accounting equation?',
        'type': 'multiple_choice',
        'options': ['Assets = Liabilities + Equity', 'Revenue = Expenses + Profit', 'Cash = Income - Expenses', 'Profit = Revenue - Costs'],
        'correct_answer': 'Assets = Liabilities + Equity',
        'difficulty': 'medium',
        'subject': 'Commerce',
        'topic': 'Accounting',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is inflation?',
        'type': 'multiple_choice',
        'options': ['Decrease in prices', 'Increase in general price level', 'Increase in unemployment', 'Decrease in GDP'],
        'correct_answer': 'Increase in general price level',
        'difficulty': 'medium',
        'subject': 'Commerce',
        'topic': 'Economic Concepts',
        'points': 2
    },
    # Art
    {
        'id': str(uuid.uuid4()),
        'question': 'Who painted the Mona Lisa?',
        'type': 'multiple_choice',
        'options': ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'],
        'correct_answer': 'Da Vinci',
        'difficulty': 'easy',
        'subject': 'Art',
        'topic': 'Renaissance Art',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What are the three primary colors?',
        'type': 'multiple_choice',
        'options': ['Red, Blue, Yellow', 'Red, Green, Blue', 'Blue, Yellow, Orange', 'Red, Yellow, Purple'],
        'correct_answer': 'Red, Blue, Yellow',
        'difficulty': 'easy',
        'subject': 'Art',
        'topic': 'Color Theory',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which art movement is Pablo Picasso associated with?',
        'type': 'multiple_choice',
        'options': ['Impressionism', 'Cubism', 'Surrealism', 'Abstract Expressionism'],
        'correct_answer': 'Cubism',
        'difficulty': 'medium',
        'subject': 'Art',
        'topic': 'Art Movements',
        'points': 2
    },
    # Social Science
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the largest continent by land area?',
        'type': 'multiple_choice',
        'options': ['Africa', 'Asia', 'North America', 'Europe'],
        'correct_answer': 'Asia',
        'difficulty': 'easy',
        'subject': 'Social Science',
        'topic': 'Geography',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Who was the first President of the United States?',
        'type': 'multiple_choice',
        'options': ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
        'correct_answer': 'George Washington',
        'difficulty': 'easy',
        'subject': 'Social Science',
        'topic': 'History',
        'points': 1
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What is the study of human behavior and societies called?',
        'type': 'multiple_choice',
        'options': ['Psychology', 'Sociology', 'Anthropology', 'All of the above'],
        'correct_answer': 'All of the above',
        'difficulty': 'medium',
        'subject': 'Social Science',
        'topic': 'Social Studies',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'Which river is the longest in the world?',
        'type': 'multiple_choice',
        'options': ['Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River'],
        'correct_answer': 'Nile River',
        'difficulty': 'medium',
        'subject': 'Social Science',
        'topic': 'Geography',
        'points': 2
    },
    {
        'id': str(uuid.uuid4()),
        'question': 'What does democracy mean?',
        'type': 'multiple_choice',
        'options': ['Rule by one person', 'Rule by the wealthy', 'Rule by the people', 'Rule by military'],
        'correct_answer': 'Rule by the people',
        'difficulty': 'easy',
        'subject': 'Social Science',
        'topic': 'Political Science',
        'points': 1
    }
]

# Sample tests for demonstration
SAMPLE_TESTS = [
    {
        'id': str(uuid.uuid4()),
        'title': 'Information Technology Fundamentals',
        'description': 'Test your knowledge of basic IT concepts, web development, and systems',
        'subject': 'Information Technology',
        'duration': 45,
        'total_questions': 8,
        'difficulty_level': 'medium',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(days=8)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Artificial Intelligence Assessment',
        'description': 'Explore AI fundamentals, algorithms, and applications',
        'subject': 'Artificial Intelligence',
        'duration': 60,
        'total_questions': 10,
        'difficulty_level': 'hard',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(days=7)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Machine Learning Concepts',
        'description': 'Test your understanding of ML algorithms, types, and evaluation',
        'subject': 'Machine Learning',
        'duration': 50,
        'total_questions': 9,
        'difficulty_level': 'hard',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(days=6)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'IQ Assessment Test',
        'description': 'Measure your logical reasoning, pattern recognition, and problem-solving skills',
        'subject': 'IQ Test',
        'duration': 40,
        'total_questions': 12,
        'difficulty_level': 'medium',
        'adaptive': False,
        'created_date': (datetime.now() - timedelta(days=5)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'General Science Test',
        'description': 'Comprehensive test covering biology, chemistry, and physics',
        'subject': 'Science Test',
        'duration': 45,
        'total_questions': 10,
        'difficulty_level': 'medium',
        'adaptive': False,
        'created_date': (datetime.now() - timedelta(days=4)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Statistics and Data Analysis',
        'description': 'Test your knowledge of statistical concepts, measures, and analysis',
        'subject': 'Statistics',
        'duration': 40,
        'total_questions': 8,
        'difficulty_level': 'medium',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(days=3)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Mathematics Proficiency Test',
        'description': 'Comprehensive math test covering algebra, geometry, and functions',
        'subject': 'Mathematics',
        'duration': 50,
        'total_questions': 10,
        'difficulty_level': 'medium',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(days=2)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Network Fundamentals',
        'description': 'Test your understanding of networking concepts, protocols, and OSI model',
        'subject': 'Network',
        'duration': 35,
        'total_questions': 7,
        'difficulty_level': 'medium',
        'adaptive': False,
        'created_date': (datetime.now() - timedelta(days=1)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Music Theory and History',
        'description': 'Explore music theory, rhythm, and classical composers',
        'subject': 'Music',
        'duration': 30,
        'total_questions': 6,
        'difficulty_level': 'easy',
        'adaptive': False,
        'created_date': (datetime.now() - timedelta(hours=12)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Commerce and Economics',
        'description': 'Test your knowledge of economic concepts, accounting, and business principles',
        'subject': 'Commerce',
        'duration': 40,
        'total_questions': 8,
        'difficulty_level': 'medium',
        'adaptive': True,
        'created_date': (datetime.now() - timedelta(hours=6)).isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Art Appreciation and History',
        'description': 'Explore art movements, famous artists, and color theory',
        'subject': 'Art',
        'duration': 25,
        'total_questions': 5,
        'difficulty_level': 'easy',
        'adaptive': False,
        'created_date': datetime.now().isoformat(),
        'status': 'published'
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Social Science Comprehensive Test',
        'description': 'Test your knowledge of geography, history, political science, and social studies',
        'subject': 'Social Science',
        'duration': 35,
        'total_questions': 8,
        'difficulty_level': 'medium',
        'adaptive': True,
        'created_date': (datetime.now() + timedelta(hours=2)).isoformat(),
        'status': 'published'
    }
]

# Initialize with sample data
if not QUESTIONS:
    QUESTIONS.extend(SAMPLE_QUESTIONS)
if not TESTS:
    TESTS.extend(SAMPLE_TESTS)
    
    # Add sample test results with proper test_id references
    if not TEST_RESULTS and len(TESTS) > 0:
        for i, result in enumerate(SAMPLE_TEST_RESULTS):
            result['test_id'] = TESTS[i % len(TESTS)]['id']
        TEST_RESULTS.extend(SAMPLE_TEST_RESULTS)

def adaptive_question_selection(subject, current_difficulty, performance_history):
    """
    AI-powered adaptive question selection based on student performance
    """
    available_questions = [q for q in QUESTIONS if q['subject'] == subject]
    
    if not performance_history:
        # Start with easy questions
        return [q for q in available_questions if q['difficulty'] == 'easy']
    
    # Calculate current performance level
    correct_answers = sum(1 for result in performance_history if result['correct'])
    total_questions = len(performance_history)
    accuracy_rate = correct_answers / total_questions if total_questions > 0 else 0
    
    # Determine next difficulty level based on performance
    if accuracy_rate >= 0.8:
        # Student performing well, increase difficulty
        if current_difficulty == 'easy':
            target_difficulty = 'medium'
        elif current_difficulty == 'medium':
            target_difficulty = 'hard'
        else:
            target_difficulty = 'hard'
    elif accuracy_rate < 0.5:
        # Student struggling, decrease difficulty
        if current_difficulty == 'hard':
            target_difficulty = 'medium'
        elif current_difficulty == 'medium':
            target_difficulty = 'easy'
        else:
            target_difficulty = 'easy'
    else:
        # Maintain current difficulty
        target_difficulty = current_difficulty
    
    # Select questions of target difficulty
    suitable_questions = [q for q in available_questions if q['difficulty'] == target_difficulty]
    
    if not suitable_questions:
        # Fallback to any available questions
        suitable_questions = available_questions
    
    return suitable_questions

def auto_grade_answer(question, student_answer):
    """
    Automated grading system with ML-based fuzzy matching for text answers
    """
    correct_answer = question['correct_answer']
    
    if question['type'] == 'multiple_choice' or question['type'] == 'true_false':
        # Exact match for MC and T/F
        is_correct = str(student_answer).lower().strip() == str(correct_answer).lower().strip()
        points_earned = question['points'] if is_correct else 0
        
    elif question['type'] == 'short_answer':
        # Fuzzy matching for short answers (simple implementation)
        student_answer_clean = str(student_answer).lower().strip()
        correct_answer_clean = str(correct_answer).lower().strip()
        
        # Check for exact match first
        if student_answer_clean == correct_answer_clean:
            is_correct = True
            points_earned = question['points']
        else:
            # Check for numerical answers with tolerance
            try:
                student_num = float(student_answer_clean)
                correct_num = float(correct_answer_clean)
                tolerance = 0.1  # 10% tolerance
                
                if abs(student_num - correct_num) <= abs(correct_num * tolerance):
                    is_correct = True
                    points_earned = question['points']
                else:
                    is_correct = False
                    points_earned = 0
            except ValueError:
                # Not a number, check for partial credit based on keywords
                correct_keywords = set(correct_answer_clean.split())
                student_keywords = set(student_answer_clean.split())
                overlap = len(correct_keywords.intersection(student_keywords))
                
                if overlap > 0:
                    # Partial credit based on keyword overlap
                    partial_score = (overlap / len(correct_keywords)) * question['points']
                    is_correct = partial_score >= question['points'] * 0.7  # 70% threshold
                    points_earned = round(partial_score, 1)
                else:
                    is_correct = False
                    points_earned = 0
    else:
        is_correct = False
        points_earned = 0
    
    return {
        'correct': is_correct,
        'points_earned': points_earned,
        'max_points': question['points']
    }

def generate_learning_insights(performance_data):
    """
    AI-powered learning insights generation
    """
    insights = []
    
    if not performance_data:
        return ["Complete more questions to receive personalized insights."]
    
    # Analyze accuracy by difficulty
    easy_correct = sum(1 for p in performance_data if p.get('difficulty') == 'easy' and p.get('correct', False))
    easy_total = sum(1 for p in performance_data if p.get('difficulty') == 'easy')
    
    medium_correct = sum(1 for p in performance_data if p.get('difficulty') == 'medium' and p.get('correct', False))
    medium_total = sum(1 for p in performance_data if p.get('difficulty') == 'medium')
    
    hard_correct = sum(1 for p in performance_data if p.get('difficulty') == 'hard' and p.get('correct', False))
    hard_total = sum(1 for p in performance_data if p.get('difficulty') == 'hard')
    
    # Generate insights based on performance patterns
    if easy_total > 0:
        easy_rate = easy_correct / easy_total
        if easy_rate >= 0.9:
            insights.append("Excellent performance on basic concepts! Ready for more challenging material.")
        elif easy_rate < 0.7:
            insights.append("Focus on strengthening fundamental concepts before advancing.")
    
    if medium_total > 0:
        medium_rate = medium_correct / medium_total
        if medium_rate >= 0.8:
            insights.append("Strong grasp of intermediate concepts. Consider advanced topics.")
        elif medium_rate < 0.6:
            insights.append("Practice more intermediate-level problems to improve understanding.")
    
    if hard_total > 0:
        hard_rate = hard_correct / hard_total
        if hard_rate >= 0.7:
            insights.append("Exceptional performance on challenging questions!")
        else:
            insights.append("Advanced concepts need more practice. Consider seeking additional help.")
    
    # Analyze performance trends
    if len(performance_data) >= 3:
        recent_performance = performance_data[-3:]
        recent_accuracy = sum(1 for p in recent_performance if p.get('correct', False)) / len(recent_performance)
        
        if recent_accuracy > 0.8:
            insights.append("Your recent performance shows consistent improvement!")
        elif recent_accuracy < 0.5:
            insights.append("Consider reviewing recent topics or seeking additional support.")
    
    return insights if insights else ["Continue practicing to receive more detailed insights."]

@test_management_bp.route('/tests', methods=['GET'])
def get_tests():
    """Get all tests"""
    try:
        return jsonify({
            'success': True,
            'tests': TESTS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/tests', methods=['POST'])
def create_test():
    """Create a new test"""
    try:
        data = request.get_json()
        
        new_test = {
            'id': str(uuid.uuid4()),
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'subject': data.get('subject', ''),
            'duration': data.get('duration', 60),
            'total_questions': data.get('total_questions', 5),
            'difficulty_level': data.get('difficulty_level', 'medium'),
            'adaptive': data.get('adaptive', True),
            'created_date': datetime.now().isoformat(),
            'status': 'draft'
        }
        
        TESTS.append(new_test)
        
        return jsonify({
            'success': True,
            'test': new_test,
            'message': 'Test created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/questions', methods=['GET'])
def get_questions():
    """Get all questions"""
    try:
        return jsonify({
            'success': True,
            'questions': QUESTIONS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/questions', methods=['POST'])
def create_question():
    """Create a new question"""
    try:
        data = request.get_json()
        
        new_question = {
            'id': str(uuid.uuid4()),
            'question': data.get('question', ''),
            'type': data.get('type', 'multiple_choice'),
            'options': data.get('options'),
            'correct_answer': data.get('correct_answer', ''),
            'difficulty': data.get('difficulty', 'medium'),
            'subject': data.get('subject', ''),
            'topic': data.get('topic', ''),
            'points': data.get('points', 1)
        }
        
        QUESTIONS.append(new_question)
        
        return jsonify({
            'success': True,
            'question': new_question,
            'message': 'Question created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/test/<test_id>/questions', methods=['GET'])
def get_test_questions(test_id):
    """Get questions for a specific test (with adaptive selection)"""
    try:
        test = next((t for t in TESTS if t['id'] == test_id), None)
        if not test:
            return jsonify({'success': False, 'error': 'Test not found'}), 404
        
        # Get performance history if available (from session or student profile)
        performance_history = request.args.get('performance_history', '[]')
        performance_history = json.loads(performance_history) if performance_history else []
        
        if test['adaptive']:
            # Use adaptive question selection
            current_difficulty = test['difficulty_level']
            suitable_questions = adaptive_question_selection(
                test['subject'], 
                current_difficulty, 
                performance_history
            )
            
            # Randomly select from suitable questions
            selected_questions = random.sample(
                suitable_questions, 
                min(test['total_questions'], len(suitable_questions))
            )
        else:
            # Fixed question selection
            subject_questions = [q for q in QUESTIONS if q['subject'] == test['subject']]
            selected_questions = random.sample(
                subject_questions,
                min(test['total_questions'], len(subject_questions))
            )
        
        return jsonify({
            'success': True,
            'questions': selected_questions,
            'adaptive': test['adaptive']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/submit', methods=['POST'])
def submit_test():
    """Submit test answers and get results with automated grading"""
    try:
        data = request.get_json()
        test_id = data.get('test_id')
        answers = data.get('answers', {})
        completion_time = data.get('completion_time', 0)
        student_name = data.get('student_name', 'Anonymous')
        
        test = next((t for t in TESTS if t['id'] == test_id), None)
        if not test:
            return jsonify({'success': False, 'error': 'Test not found'}), 404
        
        # Grade each answer
        total_score = 0
        total_points = 0
        graded_answers = []
        performance_data = []
        difficulty_progression = []
        
        for question_id, student_answer in answers.items():
            question = next((q for q in QUESTIONS if q['id'] == question_id), None)
            if question:
                grading_result = auto_grade_answer(question, student_answer)
                
                total_score += grading_result['points_earned']
                total_points += grading_result['max_points']
                
                graded_answers.append({
                    'question_id': question_id,
                    'student_answer': student_answer,
                    'correct_answer': question['correct_answer'],
                    'correct': grading_result['correct'],
                    'points_earned': grading_result['points_earned'],
                    'max_points': grading_result['max_points']
                })
                
                performance_data.append({
                    'correct': grading_result['correct'],
                    'difficulty': question['difficulty'],
                    'subject': question['subject'],
                    'topic': question['topic']
                })
                
                difficulty_progression.append(question['difficulty'])
        
        # Calculate metrics
        accuracy_rate = sum(1 for answer in graded_answers if answer['correct']) / len(graded_answers) if graded_answers else 0
        
        # Generate AI-powered learning insights
        learning_insights = generate_learning_insights(performance_data)
        
        # Create test result
        test_result = {
            'test_id': test_id,
            'student_name': student_name,
            'score': total_score,
            'total_points': total_points,
            'completion_time': completion_time,
            'adaptive_performance': {
                'difficulty_progression': difficulty_progression,
                'accuracy_rate': accuracy_rate,
                'learning_insights': learning_insights
            },
            'graded_answers': graded_answers,
            'date_taken': datetime.now().isoformat()
        }
        
        TEST_RESULTS.append(test_result)
        
        return jsonify({
            'success': True,
            'result': test_result,
            'message': 'Test submitted and graded successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/results', methods=['GET'])
def get_results():
    """Get all test results"""
    try:
        return jsonify({
            'success': True,
            'results': TEST_RESULTS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/results/<test_id>', methods=['GET'])
def get_test_results(test_id):
    """Get results for a specific test"""
    try:
        test_results = [r for r in TEST_RESULTS if r['test_id'] == test_id]
        
        # Calculate analytics
        if test_results:
            total_attempts = len(test_results)
            average_score = sum(r['score'] / r['total_points'] for r in test_results) / total_attempts
            average_time = sum(r['completion_time'] for r in test_results) / total_attempts
            
            analytics = {
                'total_attempts': total_attempts,
                'average_score_percentage': round(average_score * 100, 1),
                'average_completion_time': round(average_time, 1),
                'pass_rate': sum(1 for r in test_results if (r['score'] / r['total_points']) >= 0.6) / total_attempts * 100
            }
        else:
            analytics = {
                'total_attempts': 0,
                'average_score_percentage': 0,
                'average_completion_time': 0,
                'pass_rate': 0
            }
        
        return jsonify({
            'success': True,
            'results': test_results,
            'analytics': analytics
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@test_management_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Get comprehensive analytics across all tests"""
    try:
        # Calculate overall analytics
        total_tests = len(TESTS)
        total_questions = len(QUESTIONS)
        total_attempts = len(TEST_RESULTS)
        
        if TEST_RESULTS:
            # Performance analytics
            total_score_sum = sum(r['score'] for r in TEST_RESULTS)
            total_points_sum = sum(r['total_points'] for r in TEST_RESULTS)
            overall_average = (total_score_sum / total_points_sum) * 100 if total_points_sum > 0 else 0
            
            # Subject performance
            subject_performance = {}
            for result in TEST_RESULTS:
                test = next((t for t in TESTS if t['id'] == result['test_id']), None)
                if test:
                    subject = test['subject']
                    if subject not in subject_performance:
                        subject_performance[subject] = {'scores': [], 'attempts': 0}
                    
                    score_percentage = (result['score'] / result['total_points']) * 100
                    subject_performance[subject]['scores'].append(score_percentage)
                    subject_performance[subject]['attempts'] += 1
            
            # Calculate subject averages
            for subject in subject_performance:
                scores = subject_performance[subject]['scores']
                subject_performance[subject]['average'] = sum(scores) / len(scores) if scores else 0
            
            # Difficulty level performance
            difficulty_performance = {'easy': [], 'medium': [], 'hard': []}
            for result in TEST_RESULTS:
                for answer in result.get('graded_answers', []):
                    question = next((q for q in QUESTIONS if q['id'] == answer['question_id']), None)
                    if question and question['difficulty'] in difficulty_performance:
                        difficulty_performance[question['difficulty']].append(answer['correct'])
            
            difficulty_stats = {}
            for difficulty, results in difficulty_performance.items():
                if results:
                    accuracy = sum(results) / len(results) * 100
                    difficulty_stats[difficulty] = {
                        'accuracy': round(accuracy, 1),
                        'total_questions': len(results)
                    }
                else:
                    difficulty_stats[difficulty] = {'accuracy': 0, 'total_questions': 0}
        
        else:
            overall_average = 0
            subject_performance = {}
            difficulty_stats = {}
        
        analytics = {
            'overview': {
                'total_tests': total_tests,
                'total_questions': total_questions,
                'total_attempts': total_attempts,
                'overall_average': round(overall_average, 1)
            },
            'subject_performance': subject_performance,
            'difficulty_performance': difficulty_stats,
            'recent_activity': TEST_RESULTS[-10:] if TEST_RESULTS else []  # Last 10 results
        }
        
        return jsonify({
            'success': True,
            'analytics': analytics
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 