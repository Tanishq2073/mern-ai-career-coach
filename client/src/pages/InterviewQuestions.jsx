import { useState } from "react";
import axios from "axios";

const InterviewQuestions = () => {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult("");
      setMessage("");

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.data?.token || userInfo?.token;

      const { data } = await axios.get(
        `https://mern-ai-career-coach.onrender.com/api/ai/interview-questions?role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container ai-container">
        <div className="card ai-card">

          <h2 className="ai-title">Interview Questions Generator</h2>

          {message && <div className="message error">{message}</div>}

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Enter Job Role</label>
              <input
                type="text"
                placeholder="e.g. MERN Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <button className="btn" type="submit">
              {loading ? "Generating..." : "Generate Questions"}
            </button>
          </form>

          {result && (
            <div className="ai-result">
              {result}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;