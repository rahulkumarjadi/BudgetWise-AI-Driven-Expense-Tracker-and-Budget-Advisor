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

## 🖥 Application Preview

## 📸 Screenshots

### 🏠 Welcome & Authentication
| Home Page      | Sign In | Sign Up |
|----------------|--------|--------|
| ![Home Page](home-page.png) | ![Sign In](sign-IN.png) | ![Sign Up](sign-up.png) |

---

### 📊 Dashboard & Profile
| Main Dashboard | Dark mode      |
|---------------|----------------|
| ![Dashboard](dashboard.png) | ![Dark mode](dark-mode.png) |

---

### 📝 Transaction Management
| Transactions                      | Transactions  examples      |
|-----------------------------------|-----------------------------|
| ![Transactions](Transactions.png) | ![Transactions  examples](Transcations.png) |

| Excel Export Preview                |
|-------------------------------------|
| ![Excel Export](download-excel.png) |

---

### 🎯 Budgeting & Savings
| Set Budgets  | Edit Budget |
|--------------|------------|
| ![Budgets](budgets 2.png) | ![Edit Budget](budegts-edit.png) |

| Savings Goals | Edit Savings Goal |
|--------------|------------------|
| ![Savings Goals](savings-goals.png) | ![Edit Savings](saving-goal-edit.png) |

---

### ✨ Analytics
| Analytics      | Ai insights         |
|----------------|---------------------|
| ![Analytics](analytics.png) | ![ Ai insights  ](Ai-insights.png) |


| Alerts  | 
|---------|
| ![Alerts](alerts.png) | 


## 🎥 Demo Video (Important)
Watch the **high-quality full platform walkthrough** showcasing the complete functionality of the application, including authentication, transaction management, budgeting, analytics, alerts, and AI-powered insights.

🔗 **Watch the Demo (Google Drive – HD Quality):**  
[Click here to view the demo video](https://1drv.ms/v/c/965495f61a6e912c/IQBaGb9Cqb-JRZqeP8L4IsM_AXS4rt8ThZOvutSIqjP0VAc?e=W2ciQO)

> 📌 The video is recorded in **high resolution** to clearly demonstrate UI interactions and system workflows.


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