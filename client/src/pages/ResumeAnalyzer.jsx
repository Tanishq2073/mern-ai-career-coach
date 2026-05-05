import { useState } from "react";
import axios from "axios";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult("");
      setMessage("");

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.data?.token || userInfo?.token;

      const { data } = await axios.post(
        "https://mern-ai-career-coach.onrender.com/api/ai/resume-analysis",
        { resumeText },
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

          <h2 className="ai-title">AI Resume Analyzer</h2>

          {message && <div className="message error">{message}</div>}

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label>Paste your resume</label>
              <textarea
                className="ai-textarea"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <button className="btn" type="submit">
              {loading ? "Analyzing..." : "Analyze Resume"}
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

export default ResumeAnalyzer;