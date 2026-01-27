import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import { useState } from "react";
import "./login.css";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await loginUser(username, password);
            localStorage.setItem("user", JSON.stringify(response));
            navigate("/");
        } catch (err) {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="loginPage">
            <div className="loginCard">
                <h2>Welcome Back</h2>

                <form className="loginForm" onSubmit={handleSubmit} autoComplete="off">
                    <label>
                        Username
                        <input
                            type="text"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button type="submit">Log In</button>
                </form>

                <div className="loginFooter">
                    <span>Don’t have an account?</span>
                    <button
                        className="registerLink"
                        onClick={() => navigate("/createUser")}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}