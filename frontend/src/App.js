import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import HomePage from "./components/HomePage";
import WatchlistPage from "./components/WatchlistPage";
import ProfilePage from "./components/ProfilePage";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import "./styles/App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/logout" element={<Logout />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
