import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

 const submitHandler = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const { data } = await axios.post(
      "https://mern-ai-career-coach.onrender.com/api/users/Login",
      {
        email,
        password,
      }
    );

    console.log("LOGIN RESPONSE:", data);

    // Store user info
    localStorage.setItem("userInfo", JSON.stringify(data));

    // Navigate directly if token exists
    if (data.token || data?.data?.token) {
      navigate("/dashboard");
      window.location.reload();
    } else {
      setMessage("Login failed");
    }
  } catch (error) {
    console.log(error);

    setMessage(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};

  return (
    <div className="form-container card">
      <h2 className="form-title">Login</h2>

      {message && <div className="message error">{message}</div>}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn" type="submit">
          Login
        </button>
      </form>

      <p className="form-footer">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;