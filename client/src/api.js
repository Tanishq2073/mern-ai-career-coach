import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mern-ai-career-coach.onrender.com",
});

export default API;