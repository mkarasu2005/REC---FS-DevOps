# SecureTask – Enterprise Task Management System

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

## 🌐 GitHub Repository

Repository Link:  
https://github.com/mkarasu2005/REC---FS-DevOps

---

# 📥 How to Import (Clone) This Project

Clone the repository:

```bash
git clone https://github.com/mkarasu2005/REC---FS-DevOps.git
cd REC---FS-DevOps

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

### ▶ Step 1: Start Backend


  Go to task-backend/.env file
  MONGO_URI=mongodb://localhost:27017/taskdb Change this URL to mongodb+srv://kaviadmin:Secure123@secure-task-db-kavi.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000



