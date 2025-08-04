import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./style.css";
import { TbBinaryTree } from "react-icons/tb";

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="layout-container">
      <aside className={`navBar ${visible ? 'visible':''}` } >
        <h2>
          <TbBinaryTree onClick={() => setVisible(!visible)} className = 'binaryTree'/>
        </h2>
        {visible && (
          <ul>
            <li>
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li>
              <button onClick={() => navigate("/battle")}>Battle</button>
            </li>
            <li>
              <button onClick={() => navigate("/leaderboard")}>
                Leaderboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
