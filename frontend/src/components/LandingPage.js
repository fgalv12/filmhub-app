import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import Button from "./Button";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to FilmHub</h1>
      <p>Explore movies and TV shows to start building your watchlist!</p>
      <div className="landing-buttons">
        <Link to="/login">
          <Button className="btn">Login</Button>
        </Link>
        <Link to="/register">
          <Button className="btn">Register</Button>
        </Link>
      </div>
      <div className="landing-image-container">
        <img src="/film.jpg" alt="Movie Film" className="landing-image" />
      </div>
    </div>
  );
};

export default LandingPage;
