import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      console.log("Login successful:", res.data);

      setMessage("Login successful");
      setMessageType("success");

      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Login failed:", error.response.data.message);
        setMessage("Invalid email or password.");
      } else {
        console.error("Error:", error.message);
        setMessage("An error occurred. Please try again later.");
      }
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-control">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn-login" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
