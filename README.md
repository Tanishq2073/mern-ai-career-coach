# AI Career Coach & Job Tracker (MERN Stack)

## 🚀 Project Overview

A full-stack MERN application that helps users manage job applications, track their status, and prepare for their career using structured backend APIs.

---

## 🛠 Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- JWT Authentication
- bcrypt (password hashing)

---

## 🔐 Features

### Authentication

- User Registration
- Secure Login (JWT)
- Password hashing using bcrypt

### User Profile

- View profile
- Update profile

### Job Management

- Add job application
- View all jobs
- Update job status
- Delete job

### Search & Filter

- Search jobs by company
- Filter by status

---

## 🔒 Security

- JWT-based authentication
- Protected routes
- Environment variables (.env)

---

## 📦 API Endpoints

### User

- POST /api/users/register
- POST /api/users/login
- GET /api/users/profile
- PUT /api/users/profile

### Jobs

- POST /api/jobs
- GET /api/jobs
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/Tanishq2073/mern-ai-career-coach.git
cd server
npm install
npm run dev
```
