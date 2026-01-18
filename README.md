# AI-Budget-Tracker-Advisor

# 💰 AI Budget Tracker Advisor

An intelligent **full-stack personal finance management system** that helps users track expenses, manage budgets, analyze spending patterns, and achieve savings goals using smart analytics.

Built with **Spring Boot Microservices** on the backend and **React.js** on the frontend, this application focuses on **security, scalability, and real-time insights**.

---

## 📌 Project Overview

Managing personal finances can be overwhelming without proper insights.  
**AI Budget Tracker Advisor** simplifies money management by providing:

- Clear visibility of **income vs expenses**
- **Budget alerts** to prevent overspending
- **Visual analytics dashboards**
- **Goal-based savings tracking**

This project follows **enterprise-level architecture** and best development practices.

---



## 🎥 Demo Video (Important)

Watch the full platform walkthrough on Google Drive:

🔗 **Public Link:** https://1drv.ms/v/c/965495f61a6e912c/IQBaGb9Cqb-JRZqeP8L4IsM_AXS4rt8ThZOvutSIqjP0VAc?e=2PcCzM

The demo video showcases:
- Transaction logging
- Budget creation & monitoring
- Analytics dashboard
- AI-powered insights

---

## 🚀 Key Features

### 🔐 User Management
- Secure user registration & login
- JWT-based authentication
- Role-based access control
- Encrypted password storage

---

### 💸 Expense Tracking
- Add, update, delete transactions
- Expense categorization:
    - Food
    - Rent
    - Shopping
    - Transport
    - Entertainment
- Separate income and expense flows
- Monthly and yearly expense tracking

---

### 📊 Budget Planning
- Category-wise monthly budget allocation
- Soft limit warnings
- Hard limit alerts
- Real-time budget usage monitoring

---

### 📈 Analytics Dashboard
- Income vs Expense pie chart
- Category-wise expense bar chart
- Budget vs actual spending comparison
- Monthly financial trends

---

### 🎯 Savings Goals
- Create short-term & long-term goals
- Track progress in percentage
- Goal completion insights
- Remaining amount calculations

---

## 🧠 Smart Insights (Future Enhancements)
- AI-based spending pattern detection
- Predictive monthly expense forecasting
- Personalized savings recommendations
- Anomaly detection in transactions

---

## 🛠 Tech Stack

### 🔹 Frontend
- React.js
- Axios (API communication)
- Recharts (Data visualization)
- React Router (Navigation)
- Context API (State management)

---

### 🔹 Backend (Microservices)
- Java
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- RESTful APIs
- Hibernate

---

### 🔹 Database
- MySQL (Production)
- H2 (Development / Testing)

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup (Spring Boot)

1. Ensure **Java 17** and **Maven** are installed.
2. Open the `BudgetTracker` folder in **IntelliJ IDEA**.
3. Configure your MySQL database in:

src/main/resources/application.properties

markdown
Copy code

4. Add **Gemini API credentials** to environment variables or `application.properties`.

5. Run the backend application:

🎨 Frontend Setup (React)

Navigate to the frontend directory:

cd budget-frontend


Install dependencies:

npm install


Start the development server:

npm start


Open the application in your browser:

http://localhost:3000

🎓 Acknowledgements

Program:
Infosys Springboard 6.0 Virtual Internship – JAVA Technology Stack

Mentor:
Maria Jerina Mam
📧 springboardmentor569@gmail.com

Special Thanks:
The Infosys Springboard team for their guidance, mentorship, and learning resources throughout the internship program.