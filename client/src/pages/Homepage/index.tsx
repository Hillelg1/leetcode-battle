import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      {loggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <button onClick={() => navigate("/login")}>Log in</button>
      )}
    </div>
  );
}
