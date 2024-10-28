import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Check if the token is valid
  const isTokenValid = (token) => {
    if (!token) {
      return false;
    }
    // Decode the token
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Initialize isLoggedIn state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("authToken");
    return isTokenValid(token);
  });

  // Login function
  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  // Check for token validity
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("authToken");
      if (!isTokenValid(token)) {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
      } else {
        setIsLoggedIn(true);
      }
    };

    checkTokenValidity();

    const handleStorageChange = () => {
      checkTokenValidity();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
