import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    sort: "latest",
  });

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salaryRange: "",
    jobLink: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 AI STATES
  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [navigate, userInfo, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = userInfo?.data?.token || userInfo?.token;

      const jobsRes = await axios.get(
        `http://localhost:5000/api/jobs?keyword=${filters.keyword}&status=${filters.status}&sort=${filters.sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const statsRes = await axios.get(
        "http://localhost:5000/api/jobs/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setJobs(jobsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const addJobHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");

      const token = userInfo?.data?.token || userInfo?.token;

      await axios.post("http://localhost:5000/api/jobs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        company: "",
        role: "",
        location: "",
        salaryRange: "",
        jobLink: "",
        notes: "",
      });

      fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const deleteJobHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      const token = userInfo?.data?.token || userInfo?.token;
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete job");
    }
  };

  const updateStatusHandler = async (id, newStatus) => {
    try {
      const token = userInfo?.data?.token || userInfo?.token;
      await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  // 🔥 AI FUNCTION (CORE FEATURE)
  const generateQuestions = async (role) => {
    try {
      setLoadingAI(true);
      setAiResult("");

      const token = userInfo?.data?.token || userInfo?.token;

      const { data } = await axios.get(
        `http://localhost:5000/api/ai/interview-questions?role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiResult(data.data);
    } catch (error) {
      setAiResult("Failed to generate AI questions");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        {/* 🔥 AI NAVIGATION */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" onClick={() => navigate("/resume")}>
            Resume Analyzer
          </button>

          <button className="btn" onClick={() => navigate("/interview")}>
            Interview Questions
          </button>
        </div>
      </div>

      {message && <div className="message error">{message}</div>}
      {loading && <div className="message success">Loading...</div>}

      {/* 🔥 STATS */}
      {stats && (
        <div className="stats-grid">
          <div className="card stat-card">
            <h3>Total</h3>
            <p>{stats.totalJobs}</p>
          </div>
          <div className="card stat-card">
            <h3>Applied</h3>
            <p>{stats.applied}</p>
          </div>
          <div className="card stat-card">
            <h3>Interview</h3>
            <p>{stats.interview}</p>
          </div>
          <div className="card stat-card">
            <h3>Offer</h3>
            <p>{stats.offer}</p>
          </div>
          <div className="card stat-card">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* ADD JOB */}
        <div className="card">
          <h3>Add Job</h3>

          <form className="add-job-form" onSubmit={addJobHandler}>
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Salary Range"
              value={formData.salaryRange}
              onChange={(e) =>
                setFormData({ ...formData, salaryRange: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Job Link"
              value={formData.jobLink}
              onChange={(e) =>
                setFormData({ ...formData, jobLink: e.target.value })
              }
            />

            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />

            <button className="btn" type="submit">
              Add Job
            </button>
          </form>
        </div>

        {/* JOB LIST */}
        <div className="card">
          <h3>My Jobs</h3>

          <div className="filters-row">
            <input
              type="text"
              placeholder="Search by company or role"
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="appliedDate">Applied Date</option>
            </select>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">No jobs found</div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <h4>{job.company}</h4>
                  <p className="job-meta">Role: {job.role}</p>
                  <p className="job-meta">
                    Location: {job.location || "N/A"}
                  </p>

                  <span
                    className={`status-badge status-${job.status.toLowerCase()}`}
                  >
                    {job.status}
                  </span>

                  <div className="job-actions">
                    <button
                      className="btn"
                      onClick={() =>
                        updateStatusHandler(job._id, "Interview")
                      }
                    >
                      Interview
                    </button>

                    <button
                      className="btn"
                      onClick={() => updateStatusHandler(job._id, "Offer")}
                    >
                      Offer
                    </button>

                    <button
                      className="btn"
                      onClick={() =>
                        updateStatusHandler(job._id, "Rejected")
                      }
                    >
                      Reject
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => deleteJobHandler(job._id)}
                    >
                      Delete
                    </button>

                    {/* 🔥 AI BUTTON */}
                    <button
                      className="btn"
                      onClick={() => generateQuestions(job.role)}
                    >
                      AI Questions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🔥 AI RESULT */}
          {aiResult && (
            <div className="card" style={{ marginTop: "20px" }}>
              <h3>AI Suggestions</h3>
              <div className="ai-result">
                {loadingAI ? "Generating..." : aiResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;