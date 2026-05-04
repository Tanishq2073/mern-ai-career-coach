import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          AI Career Coach
        </Link>

        <div className="nav-links">
          {userInfo ? (
  <>
    <Link to="/dashboard">Dashboard</Link>
    <button className="btn btn-danger" onClick={logoutHandler}>
      Logout
    </button>
  </>
) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;