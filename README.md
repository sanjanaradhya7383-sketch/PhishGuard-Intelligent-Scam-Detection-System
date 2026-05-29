**PhishGuard - Intelligent Scam Detection System**
**Overview**

PhishGuard is an AI-powered scam and phishing detection system built using the MERN stack. It analyzes suspicious URLs, messages, and images to identify potential threats and provide users with risk assessments and explanations.

The system combines OCR-based text extraction, URL reputation analysis, and AI-driven threat evaluation to help users detect phishing attempts and online scams before interacting with malicious content.

**Features**
URL phishing detection and analysis
Scam message detection
OCR-based image text extraction
Risk scoring and threat assessment
Detailed explanations for detected threats
Google Safe Browsing API integration
User-friendly interface for security awareness
**Tech Stack**
Frontend-React.js,
Backend-Node.js
Express.js
Database
MongoDB
APIs & Libraries
Google Safe Browsing API
OCR.js (Optical Character Recognition)
**How It Works**
User submits a suspicious URL, message, or image.
Images are processed using OCR to extract text.
URLs are analyzed using threat intelligence and reputation checks.
The system evaluates potential phishing indicators.
A risk score and explanation are generated.
The user receives a clear assessment of the threat level.
**Project Structure**

```
PhishGuard/
│
├── App.js
├── aiAnalyzer.js
├── scamAnalyzer.js
├── urlAnalyzer.js
├── ScamModel.js
├── UrlModel.js
├── UserModel.js
├── ocr.js
└── README.md
```

**Demo**

A project demonstration video showcasing multiple test cases is included in this repository:phishguard testcases video

URL phishing detection
Scam message analysis
OCR-based image scanning
Risk assessment generation
