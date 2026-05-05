import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./Components/Navbar";
import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewQuestions from "./pages/InterviewQuestions";

<Route path="/interview" element={<InterviewQuestions />} />

<Route path="/profile" element={<Profile />} />
function App() {
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/interview" element={<InterviewQuestions />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;