# SecureTask – Secure Task Management System

## 📌 Overview
SecureTask is a full-stack secure task management application built with:

- React + TypeScript (Frontend)
- Node.js + Express + TypeScript (Backend)
- MongoDB
- Docker (Multi-stage builds)
- Nginx (SPA production serving)
- JWT Authentication
- React Query (Data fetching)

---

## 🚀 Features

- JWT Authentication (Login/Register)
- Protected Routes
- CRUD Operations for Tasks
- Type-safe full stack (Strict TypeScript)
- Production-ready Docker setup
- Multi-stage optimized builds
- SPA routing with Nginx

---

## 📦 Third-Party Integration

To enhance functionality, scalability, and maintainability, the following third-party libraries were integrated into the application:

### 1️⃣ React Query (@tanstack/react-query)
Used for efficient server-state management and API communication.

Why it was chosen:
- Automatic caching and background refetching
- Built-in loading and error state management
- Easy cache invalidation after mutations (create/update/delete)
- Reduces manual state handling compared to Redux

Impact:
Improves performance, reduces redundant API calls, and simplifies data synchronization between UI and backend.

---

### 2️⃣ Axios
Used as the HTTP client for frontend-backend communication.

Why it was chosen:
- Supports request and response interceptors
- Automatically attaches JWT token in Authorization header
- Better error handling than native fetch API

Impact:
Ensures secure, consistent, and centralized API communication.

---

### 3️⃣ Mongoose
Used as the Object Data Modeling (ODM) library for MongoDB.

Why it was chosen:
- Schema validation
- Middleware support
- Strong integration with TypeScript
- Simplifies database operations

Impact:
Provides structured, type-safe interaction with MongoDB.

---

### 4️⃣ jsonwebtoken (JWT)
Used for implementing stateless authentication.

Why it was chosen:
- Secure token-based authentication
- Easy middleware integration for route protection
- Industry-standard approach for API security

Impact:
Ensures no public access to protected APIs and enforces authentication across all backend routes.

---

### 5️⃣ bcrypt
Used for secure password hashing.

Why it was chosen:
- Salted hashing for improved security
- Protects user credentials from exposure

Impact:
Ensures secure storage of passwords in the database.

---

### 6️⃣ Tailwind CSS
Used for building a responsive and polished UI.

Why it was chosen:
- Utility-first approach
- Faster UI development
- Eliminates large custom CSS files
- Fully responsive design system

Impact:
Creates a clean, consistent, and mobile-friendly user interface.

## 🚀 Future Enhancements (If Given More Time)

### 🔹 Feature Enhancements

1️⃣UI Improvements  
- Add animations using Framer Motion  
- Dark/Light theme toggle  
- Real-time updates with WebSockets  

4️⃣ Testing  
- Unit testing using Jest  
- Integration testing for API routes  
- Frontend testing using React Testing Library  

---

## ☁️ Cloud Deployment Plan (Azure Architecture)

The application is fully Dockerized and ready for cloud deployment.

If extended, it would be deployed using Microsoft Azure with CI/CD automation:

### 🔹 Azure Container Registry (ACR)
- Store Docker images securely
- Version-controlled container storage
- Integrated with Azure Web App

### 🔹 Azure Web App (Linux Container)
- Host the Dockerized application
- Auto-scale capabilities
- Environment variable management
- Secure HTTPS access

### 🔹 Azure MongoDB (Cosmos DB - Mongo API)
- Fully managed cloud database
- High availability
- Global distribution support

---

## 🔄 CI/CD Pipeline Integration

Using GitHub Actions or Azure DevOps:

1️⃣ On every push to main branch:
   - Build Docker image
   - Run lint and type checks
   - Push image to Azure Container Registry

2️⃣ Automatically deploy to Azure Web App
   - Pull latest container image
   - Restart application
   - Zero-downtime deployment

This ensures:
- Continuous Integration
- Continuous Deployment
- Production-ready DevOps workflow
- Enterprise-grade scalability

## 🌐 GitHub Repository

Repository Link:  
https://github.com/mkarasu2005/REC---FS-DevOps

---

# 📥 How to Import (Clone) This Project

Clone the repository:

```bash
git clone https://github.com/mkarasu2005/REC---FS-DevOps.git
cd REC---FS-DevOps

# 📥 Before Run this Project create .env file in task-backend folder

  PORT=4000
  MONGO_URI=mongodb://localhost:27017/taskdb
  JWT_SECRET=Kavi@2005

# 🛠 Running the Project

You can run the project in **two ways**:

---

## 🔹 OPTION 1: Run in Development Mode (Without Docker)

### 📌 Requirements

- Node.js (v20+ recommended)
- MongoDB running locally ( It can also run in Azure DocumentDB with MongoDB compatibility)

---

### ▶ Step 1: Start Backend

```bash
cd task-backend
npm install
npm run dev

### ▶ Step 2: Start frontend
```bash
cd task-frontend
npm install
npm run dev

## 🔹 OPTION 2: Run in Production Mode (With Docker)

## 🐳 Docker Setup

### Build & Run

```bash
docker compose up --build


After docker Build Just search This link in browser http://localhost:3000/login

# 📥 To use Cloud Azure Mongo DB 

### Go to task-backend/.env file
  MONGO_URI=mongodb://localhost:27017/taskdb Change this URL to mongodb+srv://kaviadmin:Secure123@secure-task-db-kavi.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000



