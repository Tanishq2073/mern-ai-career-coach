import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewQuestions from "./pages/InterviewQuestions";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <>
      

      <Routes>
        <Route
          path="/"
          element={userInfo ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/register"
          element={userInfo ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={userInfo ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={userInfo ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/resume"
          element={userInfo ? <ResumeAnalyzer /> : <Navigate to="/" />}
        />

        <Route
          path="/interview"
          element={userInfo ? <InterviewQuestions /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;