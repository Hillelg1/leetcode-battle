import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.css";
import { GiBattleGear } from "react-icons/gi";

export default function Layout() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setAdmin(userObj.admin);
    }
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">CodeBattles
          <GiBattleGear /> 
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/battle">Battle</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              {admin && (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="http://localhost:8080/swagger-ui.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Admin
                  </a>
                </li>
              )}
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={() => {
                    localStorage.removeItem("user");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
}