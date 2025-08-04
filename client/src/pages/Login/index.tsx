import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      localStorage.setItem("user", JSON.stringify(response));
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="loginDiv">
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <button className="register" onClick={() => navigate("/createUser")}>
        Register
      </button>
    </div>
  );
}
