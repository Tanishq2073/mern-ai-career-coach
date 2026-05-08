import { useState } from "react";
import "../styles/Resume.css";

function Resume() {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
    }
  };

  const [loading, setLoading] = useState(false);
const [analysisResult, setAnalysisResult] = useState(null);

const handleAnalyze = async () => {
  if (!resumeText && !fileName) {
    alert("Please upload or paste your resume first.");
    return;
  }

  try {
    setLoading(true);

    const userInfo = JSON.parse(
  localStorage.getItem("userInfo")
);

const response = await fetch(
  "https://mern-ai-career-coach.onrender.com/api/ai/resume-analysis",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

     Authorization: `Bearer ${userInfo.data.token}`,
    },

    body: JSON.stringify({
      resumeText,
    }),
  }
);

    const data = await response.json();

    setAnalysisResult(data);
  } catch (error) {
    console.error(error);

    alert("Failed to analyze resume");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="resume-page">
      <div className="resume-container">
        {/* LEFT SIDE */}
        <div className="resume-left">
          <p className="resume-tag">AI POWERED</p>

          <h1>
            Smart Resume <span>Analyzer</span>
          </h1>

          <p className="resume-description">
            Upload your resume and get AI-powered feedback,
            ATS optimization tips, skill analysis, and career
            recommendations instantly.
          </p>

          <div className="resume-features">
            <div className="feature-card">
              <span>⚡</span>
              ATS Score Check
            </div>

            <div className="feature-card">
              <span>🧠</span>
              AI Suggestions
            </div>

            <div className="feature-card">
              <span>📈</span>
              Skill Analysis
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="resume-card">
          <h2>Upload Resume</h2>

          <p className="card-subtitle">
            Upload PDF or paste resume text manually
          </p>

          {/* FILE UPLOAD */}
          <label className="upload-box">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              hidden
            />

            <div className="upload-content">
              <div className="upload-icon">📄</div>

              <h3>Upload Resume PDF</h3>

              <p>
                Drag & drop or click to upload your resume
              </p>

              {fileName && (
                <span className="uploaded-file">
                  {fileName}
                </span>
              )}
            </div>
          </label>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* TEXTAREA */}
          <textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) =>
              setResumeText(e.target.value)
            }
          />

          {/* BUTTON */}
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          {analysisResult && (
            <div className="analysis-result">
              <h3>ATS Score: {analysisResult.atsScore}/100</h3>
              
              <p>{analysisResult.feedback}</p>
              
              <div className="coming-soon-box">
                <h4>🚀 Coming Soon</h4>
                <ul>
                  <li>AI Resume Improvements</li>
                  <li>Skill Gap Detection</li>
                  <li>AI Career Recommendations</li>
                  <li>Job Match Analysis</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Resume;