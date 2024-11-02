import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  // User info state
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    watchlist: [],
  });
  // Password data state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  // Error message state
  const [errors, setErrors] = useState({
    profile: "",
    password: "",
  });
  // Success message state
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Fetch user info from the server
      try {
        const res = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUserInfo({
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          watchlist: res.data.watchlist,
        });
      } catch (error) {
        console.error("Error fetching user info: ", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          profile: {
            ...prevErrors.profile,
            fetch: "Error fetching user info. Please try again later.",
          },
        }));
      }
    };
    fetchUserInfo();
  }, []);

  // Handle input change for profile form
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

    // Clear error message when input field is changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      profile: {
        ...prevErrors.profile,
        [e.target.name]: "",
      },
    }));
  };

  // Handle input change for password form
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    // Clear error message when input field is changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: { ...prevErrors.password, [e.target.name]: "" },
    }));
  };

  // Validation function for profile form
  const validateProfile = () => {
    const { email, firstName, lastName } = userInfo;
    const profileErrors = {};

    // Validate email
    if (!email.trim()) {
      profileErrors.email = "Email is required";
    } else {
      // Email regex pattern for validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        profileErrors.email = "Please enter a valid email address";
      }
    }

    // Validate first name
    if (!firstName.trim()) {
      profileErrors.firstName = "First name is required";
    } else {
      // Name regex pattern for validation
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(firstName)) {
        profileErrors.firstName = "First name must contain only letters";
      }
    }

    // Validate last name
    if (!lastName.trim()) {
      profileErrors.lastName = "Last name is required";
    } else {
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(lastName)) {
        profileErrors.lastName = "Last name must contain only letters";
      }
    }

    return profileErrors;
  };

  // Validation function for password form
  const validatePassword = () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;
    const passwordErrors = {};

    // Validate current password
    if (!currentPassword.trim()) {
      passwordErrors.currentPassword = "Current password is required";
    }

    // Validate new password
    if (!newPassword.trim()) {
      passwordErrors.newPassword = "New password is required";
    } else {
      // Minimum eight characters, at least one letter, one number and one special character
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&?])[A-Za-z\d!@#$%&?]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        passwordErrors.newPassword =
          "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.";
      }
    }

    // Validate confirm new password
    if (!confirmNewPassword.trim()) {
      passwordErrors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword !== confirmNewPassword) {
      passwordErrors.confirmNewPassword = "Passwords do not match";
    }

    return passwordErrors;
  };

  // Handle profile update function
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors((prevErrors) => ({ ...prevErrors, profile: "" }));
    setSuccessMessage("");
    // Validate profile fields
    const profileErrors = validateProfile();
    // If there are errors, set the errors state and return
    if (Object.keys(profileErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, profile: profileErrors }));
      return;
    }

    // Update profile information
    try {
      const res = await axios.put("/api/users/profile", userInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Profile updated successfully:", res.data);
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile: ", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        profile: {
          ...prevErrors.profile,
          update:
            error.response?.data?.message ||
            "Error updating profile. Please try again later.",
        },
      }));
    }
  };

  // Handle password update function
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    setPasswordSuccessMessage("");
    // Validate password fields
    const passwordErrors = validatePassword();
    // If there are errors, set the errors state and return
    if (Object.keys(passwordErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, password: passwordErrors }));
      return;
    }

    // Update password information
    try {
      await axios.put("/api/users/update-password", passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Password updated successfully");
      setPasswordSuccessMessage("Password updated successfully");
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Error updating password: ", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: {
          ...prevErrors.password,
          update:
            error.response?.data?.message ||
            "Error updating password. Please try again later.",
        },
      }));
    }
  };

  // Clear profile success message after delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear password success message after delay
  useEffect(() => {
    if (passwordSuccessMessage) {
      const timer = setTimeout(() => {
        setPasswordSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccessMessage]);

  return (
    <div className="profile-page">
      <h2> User Profile</h2>
      <form className="profile-form" onSubmit={handleProfileUpdate} noValidate>
        <h3>Profile Information</h3>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.profile.update && (
          <p className="error-message">{errors.profile.update}</p>
        )}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={handleInputChange}
            autoComplete="email"
          />
          {errors.profile.email && (
            <span className="error-message" id="email-error">
              {errors.profile.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={userInfo.firstName}
            onChange={handleInputChange}
          />
          {errors.profile.firstName && (
            <span className="error-message" id="firstName-error">
              {errors.profile.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={userInfo.lastName}
            onChange={handleInputChange}
          />
          {errors.profile.lastName && (
            <span className="error-message" id="lastName-error">
              {errors.profile.lastName}
            </span>
          )}
        </div>

        <button className="btn-update-profile" type="submit">
          Update Profile
        </button>
      </form>

      <form
        className="password-form"
        onSubmit={handlePasswordUpdate}
        noValidate
      >
        <h3>Change Password</h3>
        {passwordSuccessMessage && (
          <p className="success-message">{passwordSuccessMessage}</p>
        )}
        {errors.password.update && (
          <p className="error-message">{errors.password.update}</p>
        )}

        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="Current Password"
            autoComplete="current-password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          {errors.password.currentPassword && (
            <span className="error-message" id="currentPassword-error">
              {errors.password.currentPassword}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            autoComplete="new-password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          {errors.password.newPassword && (
            <span className="error-message" id="newPassword-error">
              {errors.password.newPassword}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            autoComplete="new-password"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
          />
          {errors.password.confirmNewPassword && (
            <span className="error-message" id="confirmNewPassword-error">
              {errors.password.confirmNewPassword}
            </span>
          )}
        </div>

        <p className="password-info">
          Password must be at least 8 characters long and contain at least one
          letter, one number, and one special character.
        </p>

        <button className="btn-update-password" type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
