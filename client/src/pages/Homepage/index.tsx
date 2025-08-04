import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  useEffect(() => {
    // Check if user is stored in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
      const userObj = JSON.parse(user);
      setUsername(userObj.username);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);
  if (loggedIn === null) return null;
  return (
    <div>
      <h1>Home Page</h1>
      {loggedIn ? (
        <p>Welcome back! {username}</p>
      ) : (
        <button onClick={() => navigate("/login")}>Log in</button>
      )}
    </div>
  );
}
