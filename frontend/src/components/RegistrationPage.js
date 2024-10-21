import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&?])[A-Za-z\d!@#$%&?]{8,}$/; // Minimum eight characters, at least one letter, one number and one special character
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
      );
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 20000);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        firstName,
        lastName,
        email,
        password,
      });
      console.log("Registration successful:", res.data);
      setMessage("Registration successful");
      setMessageType("success");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Registration failed:", error.response.data.message);
        setMessage("Registration failed.");
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
    <div className="registration-page">
      <h2>Registration</h2>
      <p>Register to start building your watchlist!</p>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>
        <div className="form-control">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
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
            autoComplete="new-password"
          />
        </div>
        <div className="form-control">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button className="btn-register" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
