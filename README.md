# 🛡️ CyberShield X

## AI-Powered Cybersecurity Platform

CyberShield X is a modern AI-powered cybersecurity platform designed to help users identify, analyze, and respond to cyber threats through an intelligent and user-friendly interface.

The platform combines Artificial Intelligence, Threat Intelligence, Authentication Systems, and Security Analytics to provide protection against phishing attacks, malicious URLs, weak passwords, and other cybersecurity risks.

---

## 🚀 Features

### 🔐 Authentication System
- User Registration
- User Login
- Google Sign-In (Firebase Authentication)
- Secure Logout
- User Profile Management
- Protected Routes

### 🔑 Password Security Analyzer
- Password Strength Analysis
- Security Score Calculation
- Weak Password Detection
- Password Improvement Suggestions

### 🌐 URL Intelligence Engine
- Suspicious URL Detection
- HTTPS Verification
- Phishing URL Detection
- Domain Risk Analysis
- Threat Assessment

### 📧 Email Phishing Detector
- Phishing Email Detection
- Suspicious Keyword Analysis
- Fraudulent Link Detection
- Threat Classification

### 🤖 AI Security Copilot
- Cybersecurity Question Answering
- Threat Explanations
- Security Recommendations
- Security Awareness Assistance

### 📊 Security Dashboard
- Security Score
- Threat Statistics
- Activity Monitoring
- Security Insights

### 📚 Scan History
- Password Scan Records
- URL Scan Records
- Email Scan Records
- User Activity Logs

### 📄 Security Reports
- PDF Report Generation
- Threat Summary Reports
- Security Assessment Reports

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Firebase Authentication
 │
 ▼
Flask Backend API
 │
 ├── Password Analyzer
 ├── URL Analyzer
 ├── Email Detector
 ├── AI Security Copilot
 ├── Report Generator
 │
 ▼
SQLite Database
 │
 ▼
Threat Intelligence APIs
```

---

## 💻 Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Chart.js
- Framer Motion

### Backend
- Python
- Flask
- Flask-CORS

### Database
- SQLite

### Authentication
- Firebase Authentication
- Google OAuth

### Future Integrations
- VirusTotal API
- OpenAI API
- IBM Watsonx AI

---

## 📂 Project Structure

```text
CyberShieldX
│
├── backend
│   ├── app.py
│   ├── database.db
│   ├── requirements.txt
│   └── routes
│       ├── password.py
│       ├── url.py
│       ├── email.py
│       └── chatbot.py
│
└── frontend
    ├── src
    │   ├── firebase
    │   ├── context
    │   ├── components
    │   ├── pages
    │   └── styles
    │
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/CyberShieldX.git

cd CyberShieldX
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

Backend URL:

```text
http://127.0.0.1:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🔥 Firebase Setup

1. Create a Firebase Project.
2. Enable Email/Password Authentication.
3. Enable Google Authentication.
4. Create a Web App.
5. Copy Firebase Configuration.
6. Configure:

```text
src/firebase/firebase.js
```

---

## 📈 Future Enhancements

- VirusTotal Integration
- Malware Scanner
- Security Score Engine
- Threat Feed
- AI Threat Prediction
- Dark Web Monitoring
- Live Attack Map
- Multi-Factor Authentication (MFA)
- Advanced Analytics Dashboard

---

## 🎯 Project Objectives

- Improve cybersecurity awareness.
- Detect phishing attacks.
- Analyze malicious URLs.
- Evaluate password strength.
- Provide AI-driven security recommendations.
- Offer a centralized security monitoring platform.

---

## 📸 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- Password Analyzer
- URL Analyzer
- Email Detector
- AI Security Copilot

---

## 👨‍💻 Author

**Vignesh R**

CyberShield X – AI-Powered Cybersecurity Platform

---

## 📜 License

This project is developed for educational, research, and demonstration purposes.
