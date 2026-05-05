# AI Career Coach & Job Tracker

A full-stack MERN application that helps users manage job applications and use AI features for resume analysis and interview preparation.

---

## Features

- User Authentication (JWT login/register)
- Protected routes
- Job CRUD (Add, Update, Delete)
- Search, Filter, Sort jobs
- Dashboard with stats
- AI Resume Analyzer
- AI Interview Questions Generator
- AI integrated inside job workflow

---

## Tech Stack

### Frontend

- React.js
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### AI

- OpenAI API

---

## Project Structure

client/ - React frontend  
server/ - Express backend

---

## Setup Instructions

### Backend

cd server  
npm install  
node index.js

Create .env file:

MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_jwt_secret  
OPENAI_API_KEY=your_openai_api_key

---

### Frontend

cd client  
npm install  
npm run dev

---

## Deployment

Frontend → Vercel  
Backend → Render  
Database → MongoDB Atlas

---

## Author

Tanishq Gupta
