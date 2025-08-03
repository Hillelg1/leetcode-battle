import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="loginDiv">
      <form className="loginForm">
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
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
