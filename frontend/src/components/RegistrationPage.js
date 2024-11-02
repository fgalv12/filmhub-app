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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation functions
  // Validate first name
  const validateFirstName = (name) => {
    if (!name.trim()) {
      return "First name is required.";
    }
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      return "First name can only contain letters.";
    }
    if (name.length < 1 || name.length > 30) {
      return "First name must be between 1 and 30 characters.";
    }
    return "";
  };
  // Validate last name
  const validateLastName = (name) => {
    if (!name.trim()) {
      return "Last name is required.";
    }
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      return "Last name can only contain letters.";
    }
    if (name.length < 1 || name.length > 30) {
      return "Last name must be between 1 and 30 characters.";
    }
    return "";
  };
  // Validate email
  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required.";
    }
    // Email regex for more strict validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };
  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required.";
    }
    // Minimum eight characters, at least one letter, one number and one special character
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&?])[A-Za-z\d!@#$%&?]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.";
    }
    return "";
  };
  // Validate confirm password
  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Please confirm your password.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  // Validation before form submission
  const validateInputs = () => {
    const newErrors = {};

    const firstNameError = validateFirstName(firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateLastName(lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("Please fix the errors in the form.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return;
    }

    // Clear errors
    setErrors({});
    setMessage("");
    setMessageType("");

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

    // // Validate password strength
    // const passwordRegex =
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&?])[A-Za-z\d!@#$%&?]{8,}$/; // Minimum eight characters, at least one letter, one number and one special character
    // if (!passwordRegex.test(password)) {
    //   setMessage(
    //     "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
    //   );
    //   setMessageType("error");
    //   setTimeout(() => {
    //     setMessage("");
    //     setMessageType("");
    //   }, 20000);
    //   return;
    // }

    try {
      // Send registration data to the backend
      await axios.post("http://localhost:5000/api/users/register", {
        firstName,
        lastName,
        email,
        password,
      });

      console.log("Registration successful");
      setMessage("Registration successful. Please log in.");
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

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };

  return (
    <div className="registration-page">
      <h2>Registration</h2>
      <p>Register to start building your watchlist!</p>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        <div className="form-control">
          <label htmlFor="first-name">First Name:</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="last-name">Last Name:</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

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
          {errors.email && <span className="error">{errors.email}</span>}
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
            autoComplete="new-password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-control">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <p className="password-info">
          Password must be at least 8 characters long and contain at least one
          letter, one number, and one special character.
        </p>
        <button className="btn-register" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
