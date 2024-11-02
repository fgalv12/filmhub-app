import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // Validation function
  const validateInputs = () => {
    let isValid = true;

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Invalid password length.");
      isValid = false;
    } else if (password.length > 20) {
      setPasswordError("Password must not exceed 20 characters.");
      isValid = false;
    }

    return isValid;
  };

  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    const isValid = validateInputs();
    // If validation fails, abort submission
    if (!isValid) {
      return;
    }

    // Send login request
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      // If token is received, login is successful
      if (data.token) {
        // Login function from AuthContext
        login(data.token);

        console.log("Login successful");
        setMessage("Login successful");
        setMessageType("success");

        // Redirect to home page after successful login
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        console.error("No token received in login response");
        setMessage("Login failed. No token received.");
        setMessageType("error");
      }
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>

        <div className="form-control">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {passwordError && <span className="error">{passwordError}</span>}
        </div>

        <button className="btn-login" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
