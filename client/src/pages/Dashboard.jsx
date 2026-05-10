import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Dashboard.css";
import Navbar from "../Components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const token = userInfo?.data?.token || userInfo?.token;

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!userInfo || !token) {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [filters.keyword, filters.status, filters.sort]);

  const getJobsArray = (responseData) => {
    if (Array.isArray(responseData?.data?.jobs)) return responseData.data.jobs;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.jobs)) return responseData.jobs;
    if (Array.isArray(responseData)) return responseData;
    return [];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const jobsRes = await API.get(
        `/api/jobs?keyword=${filters.keyword}&status=${filters.status}&sort=${filters.sort}`,
        authHeaders
      );

      const statsRes = await API.get("/api/jobs/stats", authHeaders);

      const jobsData = getJobsArray(jobsRes.data);

      setJobs(jobsData);
      setStats(statsRes.data?.data || null);
    } catch (error) {
      setJobs([]);
      setStats(null);
      setMessage(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const addJobHandler = async (e) => {
    e.preventDefault();

    if (!formData.company || !formData.role) {
      setMessage("Company and role are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.post("/api/jobs", formData, authHeaders);

      setFormData({
        company: "",
        role: "",
        location: "",
        salaryRange: "",
        jobLink: "",
        notes: "",
      });

      await fetchDashboardData();
      setMessage("Job added successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  const deleteJobHandler = async (id) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/jobs/${id}`, authHeaders);
      await fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete job");
    }
  };

  const updateStatusHandler = async (id, newStatus) => {
    try {
      await API.put(`/api/jobs/${id}`, { status: newStatus }, authHeaders);
      await fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  const generateQuestions = async (role) => {
    try {
      setLoadingAI(true);
      setAiResult("");

      const { data } = await API.get(
        `/api/ai/interview-questions?role=${encodeURIComponent(role)}`,
        authHeaders
      );

      setAiResult(data.data || "No AI response received");
    } catch (error) {
      setAiResult("Failed to generate AI interview questions");
    } finally {
      setLoadingAI(false);
    }
  };

  const logoutHandler = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");

  navigate("/");

  window.location.reload();
};

  const userName = userInfo?.name || userInfo?.data?.name || "User";
  const userEmail = userInfo?.email || userInfo?.data?.email || "user@email.com";

  const safeStats = {
    totalJobs: stats?.totalJobs || jobs.length || 0,
    applied: stats?.applied || 0,
    interview: stats?.interview || 0,
    offer: stats?.offer || 0,
    rejected: stats?.rejected || 0,
  };

  

  const careerInsight = useMemo(() => {
    if (safeStats.totalJobs === 0) {
      return "Start adding applications to unlock AI-powered career insights.";
    }

    if (safeStats.interview === 0 && safeStats.totalJobs >= 2) {
      return "You are applying consistently. Improve your resume keywords and tailor applications more carefully.";
    }

    if (safeStats.interview > 0 && safeStats.offer === 0) {
      return "Your resume is working. Focus now on interview preparation and communication.";
    }

    if (safeStats.offer > 0) {
      return "Excellent progress. You are converting opportunities into offers.";
    }

    return "Keep improving your profile consistently.";
  }, [safeStats.totalJobs, safeStats.interview, safeStats.offer]);

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <header className="dashboard-navbar">
        <div className="navbar-brand">
          <div className="brand-icon">AI</div>

          <div>
            <h2>Career Coach</h2>
            <p>AI Job Tracker</p>
          </div>
        </div>

        <nav className="navbar-links">
          <button className="active">Dashboard</button>

          <button onClick={() => navigate("/resume")}>Resume</button>

          <button onClick={() => navigate("/interview")}>Interview Prep</button>
        </nav>

        <div className="navbar-profile-wrap">
          <button
            className="navbar-profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=6d28d9&color=fff`}
              alt="profile"
            />

            <div>
              <h4>{userName}</h4>
              <p>{userEmail}</p>
            </div>

            <span className="dropdown-arrow">⌄</span>
          </button>

          {showDropdown && (
            <div className="profile-menu">
              <button onClick={() => navigate("/profile")}>View Profile</button>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-container">
        {/* HERO */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <p className="hero-badge">WELCOME BACK</p>

            <h1>
              Hi, {userName} <span>👋</span>
            </h1>

            <p className="hero-description">
              Track applications, improve your resume, and grow your career with
              AI-powered insights.
            </p>

            <div className="hero-actions">
              <button className="primary-gradient" onClick={() => navigate("/resume")}>
                Analyze Resume
              </button>

              <button className="outline-gradient" onClick={() => navigate("/interview")}>
                Practice Interview
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>

            <div className="browser-card">
              <div className="browser-top">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="browser-body">
                <div className="mini-line purple"></div>
                <div className="mini-line light"></div>
                <div className="mini-chart"></div>
                <div className="donut"></div>
              </div>
            </div>

            <div className="floating-card">
              <div className="briefcase-icon">💼</div>
              <div>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="sparkle sparkle-one">✦</div>
            <div className="sparkle sparkle-two">✦</div>
          </div>
        </section>

        {message && <div className="alert">{message}</div>}
        {loading && <div className="loading-box">Loading dashboard...</div>}

        {/* STATS */}
        <section className="stats-grid">
          <StatCard icon="💼" title="Applications" value={safeStats.totalJobs} label="Total tracked jobs" />
          <StatCard icon="📨" title="Applied" value={safeStats.applied} label="Waiting response" />
          <StatCard icon="👥" title="Interviews" value={safeStats.interview} label="Active opportunities" />
          <StatCard icon="🏆" title="Offers" value={safeStats.offer} label="Positive outcomes" />
          <StatCard icon="✖" title="Rejected" value={safeStats.rejected} label="Learning experiences" />
        </section>

        {/* INSIGHTS */}
        <section className="insight-grid">
          <div className="ai-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">AI INSIGHT</p>
                <h2>Career Recommendation</h2>
              </div>

              <span className="ai-pill">AI</span>
            </div>

            <p className="insight-text">{careerInsight}</p>

            <div className="insight-actions">
              <button className="primary-btn" onClick={() => navigate("/resume")}>
                Improve Resume
              </button>

              <button className="secondary-btn" onClick={() => navigate("/interview")}>
                Prepare Interview
              </button>
            </div>
          </div>

          <div className="progress-panel">
            <p className="eyebrow">PIPELINE</p>
            <h2>Application Funnel</h2>

            <FunnelRow label="Applied" value={safeStats.applied} total={safeStats.totalJobs} />
            <FunnelRow label="Interview" value={safeStats.interview} total={safeStats.totalJobs} />
            <FunnelRow label="Offer" value={safeStats.offer} total={safeStats.totalJobs} />
            <FunnelRow label="Rejected" value={safeStats.rejected} total={safeStats.totalJobs} />
          </div>
        </section>

        {/* CONTENT */}
        <section className="content-grid">
          <div className="form-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">NEW APPLICATION</p>
                <h2>Add Job</h2>
              </div>
            </div>

            <form onSubmit={addJobHandler} className="job-form">
              <input
                type="text"
                placeholder="Company *"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Role *"
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

              <button className="primary-btn full-btn" type="submit">
                Add Job
              </button>
            </form>
          </div>

          <div className="jobs-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">APPLICATIONS</p>
                <h2>My Jobs</h2>
              </div>

              <span className="count-pill">{jobs.length} jobs</span>
            </div>

            <div className="filters-row">
              <input
                type="text"
                placeholder="Search jobs..."
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
              </select>
            </div>

            {!Array.isArray(jobs) || jobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Add your first application to start tracking.</p>
              </div>
            ) : (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <article className="job-card" key={job._id}>
                    <div className="job-card-top">
                      <div>
                        <h3>{job.role}</h3>
                        <p>{job.company}</p>
                      </div>

                      <span className={`status-badge ${getStatusClass(job.status)}`}>
                        {job.status || "Applied"}
                      </span>
                    </div>

                    <div className="job-meta-grid">
                      <span>📍 {job.location || "Remote"}</span>
                      <span>💰 {job.salaryRange || "Not added"}</span>
                      <span>📝 {job.notes ? "Notes added" : "No notes"}</span>
                    </div>

                    {job.jobLink && (
                      <a
                        className="job-link"
                        href={job.jobLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Job Posting
                      </a>
                    )}

                    <div className="job-actions">
                      <button onClick={() => updateStatusHandler(job._id, "Applied")}>Applied</button>
                      <button onClick={() => updateStatusHandler(job._id, "Interview")}>Interview</button>
                      <button onClick={() => updateStatusHandler(job._id, "Offer")}>Offer</button>
                      <button onClick={() => updateStatusHandler(job._id, "Rejected")}>Reject</button>
                      <button onClick={() => generateQuestions(job.role)}>AI Questions</button>
                      <button className="danger-action" onClick={() => deleteJobHandler(job._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {(loadingAI || aiResult) && (
          <section className="ai-result-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">AI OUTPUT</p>
                <h2>Interview Questions</h2>
              </div>
            </div>

            <div className="ai-output">
              {loadingAI ? "Generating AI questions..." : aiResult}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <h4>{title}</h4>
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </div>
  );
}

function FunnelRow({ label, value, total }) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="funnel-row">
      <div className="funnel-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function getStatusClass(status) {
  const value = String(status || "").toLowerCase();

  if (value === "interview") return "status-interview";
  if (value === "offer") return "status-offer";
  if (value === "rejected") return "status-rejected";

  return "status-applied";
}

export default Dashboard;