import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    watchlist: [],
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Fetch user info
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
      }
    };
    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Update profile
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
      setErrors({ profile: "Error updating profile. Please try again later." });
    }
  };

  setTimeout(() => {
    setSuccessMessage("");
  }, 5000);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setPasswordSuccessMessage("");

    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrors({ password: "Passwords do not match" });
      setTimeout(() => {
        setErrors({});
      }, 5000);
      return;
    }

    // Validate password, Minimum eight characters, at least one letter, one number and one special character
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%&?])[A-Za-z\d!@#$%&?]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setErrors({
        password:
          "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
      });
      setTimeout(() => {
        setErrors({});
      }, 20000);
      return;
    }

    // Update password
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
      setErrors({
        password: error.response.data.message || "Error updating password.",
      });
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }
    setTimeout(() => {
      setPasswordSuccessMessage("");
    }, 5000);
  };

  return (
    <div className="profile-page">
      <h2> User Profile</h2>
      <form className="profile-form" onSubmit={handleProfileUpdate}>
        <h3>Profile Information</h3>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.profile && <p className="error-message">{errors.profile}</p>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={userInfo.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={userInfo.lastName}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn-update-profile" type="submit">
          Update Profile
        </button>
      </form>

      <form className="password-form" onSubmit={handlePasswordUpdate}>
        <h3>Change Password</h3>
        {passwordSuccessMessage && (
          <p className="success-message">{passwordSuccessMessage}</p>
        )}
        {errors.password && <p className="error-message">{errors.password}</p>}
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            autoComplete="current-password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            autoComplete="new-password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            autoComplete="new-password"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
          />
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
