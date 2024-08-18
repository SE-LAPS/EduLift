# 🎓 Educational Management System (EduLift)

**Introduction**

🚀 Welcome to the Educational Management System (EduLift) repository! Developed as part of the IIT Internship Program, our project aims to revolutionize educational institutions' administrative and academic processes. By focusing on automation, seamless communication, and real-time insights, we strive to enhance the overall educational experience. In today's dynamic landscape, institutions face challenges like student admission, course management, and exam scheduling, including evaluation. Our EMS offers a centralized platform to automate key tasks, facilitate effortless communication, and provide valuable insights for data-driven decision-making. Join us in shaping the future of educational management by exploring the repository and contributing to its development.

<br />

**📚 Table of Contents**

1. 🌟 Key Technologies and Skills
2. 🛠️ Installation
3. 🚀 Usage
4. ✨ Features
5. 🤝 Contributing
6. 📜 License
7. 📧 Contact

<br />

**🌟 Key Technologies and Skills**
- 🐍 Python
- 🤖 TensorFlow
- 🧠 Convolutional Neural Network (CNN)
- 📚 Keras
- 🧪 Scikit-learn
- 👁️ OpenCV
- 🖼️ Pillow
- 🐘 PostgreSQL
- 🔢 Numpy
- 🗃️ Pandas
- 🌐 Streamlit

<br />

**🛠️ Installation**

To run this project, you need to install the following packages:

```python
pip install opencv-python
pip install numpy
pip install pandas
pip install psycopg2
pip install python-dotenv
pip install bcrypt
pip install streamlit
pip install streamlit_option_menu
pip install streamlit_extras
pip install pillow
pip install scikit-learn
pip install tensorflow
```

**Note:** If you face "ImportError: DLL load failed" error while installing TensorFlow,
```python
pip uninstall tensorflow
pip install tensorflow==2.12.0 --upgrade
```

<br />

**Usage**

To use this project, follow these steps:

1. Clone the repository: ```git clone https://github.com/SE-LAPS/EduLift.git```
2. Install the required packages: ```pip install -r requirements.txt```
3. Run the Streamlit app: ```streamlit run app.py```
4. Access the app in your browser at ```http://localhost:8501```

<br />

**Features**

**User Management:**
   - **Add New Users:** Admins possess the capability to seamlessly onboard teachers, assistants, supersubs, and students into the system by effortlessly adding new users.
   - **Update User Roles:** Admins wield authority over user roles, ensuring precise access levels and permissions for diverse stakeholders.
   - **Password Management:** Admins facilitate seamless access to the system by offering password resets for users who have forgotten their login credentials.
   - **User Deletion and Inactivation:** Admins maintain the integrity and security of the user database by adeptly managing user accounts, including deletion and temporary deactivation as necessary.

**Deep Learning Model Management:**
   - **Model Training and Retraining:** Teachers adeptly train or retrain Convolutional Neural Network (CNN) deep learning models with student handwriting data, enhancing model accuracy for handwriting verification purposes.
   - **Handwriting Verification:** Teachers ensure the authenticity and accuracy of student assessments and exam answer sheets by leveraging trained CNN models for precise handwriting verification for both assessment and exam answer sheets.

**Test Management:**
   - **Test Creation and Deployment:** Teachers seamlessly administer assessments by uploading sets of test questions and answers, facilitating efficient test creation and deployment.
   - **Supersub Identification:** Teachers recognize and acknowledge top-performing students (supersubs) based on their scores in particular concepts, fostering academic excellence.

**Role and Marks Management:**
   - **Role Updates:** Teachers ensure smooth transitions and role assignments within the system by promptly updating student roles to supersubs and assistants as needed.
   - **Viewing Student Marks:** Teachers effectively monitor student progress and performance by accessing and reviewing student marks in both tests and exams.
   - **Mark Display Approval:** Teachers can analyze and approve student exam marks for display in the student portal. They select either average or maximum marks calculated from multiple evaluators assessments. Teachers also have the option to retract their approval, preventing marks from being shown in the portal.

**Test and Exam Participation:**
   - **Test Attendance and Submission:** Students engage in remote assessment seamlessly by attending tests in their portal and submitting their answers with ease.
   - **Answer Submission Process:** Students submit both assessments and exam answer sheets, who scan and upload them for evaluation by both assistants and supersubs.
   - **Access to Marks:** Students track their academic progress and performance over time by conveniently accessing and reviewing their test and exam marks in their portal.

**Exam Answer Sheet Management and Evaluation Process:**
   - **Collection and Upload:** Assistants and supersubs efficiently manage exam answer sheets by collecting, scanning, and uploading them to the portal for evaluation.
   - **Answer Sheet Evaluation:** Assistants and supersubs ensure fair and accurate assessment by evaluating exam answer sheets and providing marks.
   - **Multiple Evaluator System:** To uphold assessment integrity, each exam answer sheet undergoes evaluation by multiple evaluators, enhancing assessment reliability and validity.

<br />


**Contributing**

Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request.

<br />


## 📝 License
    This project is licensed under the MIT License. See the LICENSE file for more details.
    
## 📧 Contact
For any inquiries or feedback, reach out to me at [Lahiru Senavirathna](https://bit.ly/Lahiru_Senavirathna).

