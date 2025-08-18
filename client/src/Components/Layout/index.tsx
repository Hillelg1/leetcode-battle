import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./style.css";
import { TbBinaryTree } from "react-icons/tb";

export default function Layout() {

  const navigate = useNavigate();
  return (
    <div className="layout-container">
      <aside className={`navBar visible` } >
        <h2>
          <TbBinaryTree className = 'binaryTree'/>
        </h2>
          <ul className="menuBar">
            <li className="home">
              <button onClick={() => navigate("/")}>Home</button>
            </li>
            <li className="battle">
              <button onClick={() => navigate("/battle")}>Battle</button>
            </li>
            <li className="leaderboard">
              <button onClick={() => navigate("/leaderboard")}>
                Leaderboard
              </button>
            </li>
            <li className="logout">
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
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
