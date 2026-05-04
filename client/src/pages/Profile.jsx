import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }

    const data = userInfo.data || userInfo;
    setName(data.name || "");
    setEmail(data.email || "");
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const token = userInfo?.data?.token || userInfo?.token;

      await axios.put(
        "http://localhost:5000/api/users/profile",
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="form-container card">
      <h2 className="form-title">Update Profile</h2>
      {message && <div className="message success">{message}</div>}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button className="btn" type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;