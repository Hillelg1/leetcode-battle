import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUser } from "../../api";

export default function NewUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      console.log("trying to create user", username, password);
      const response = await createUser(username, password);
      JSON.parse(response)
      alert("User created successfully");
      navigate("/login");
    } catch (error) {
      alert("User creation failed");
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="createUserDiv">
      <form
        className="createUserForm"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label>
          Username:
          <input
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
