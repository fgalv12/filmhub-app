import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Function to close the menu when a link is clicked
  const handleLinkClick = () => toggleMenu();

  // Links to display based on the user's authentication status
  const authLinks = [
    { path: "/home", label: "Home" },
    { path: "/watchlist", label: "Watchlist" },
    { path: "/profile", label: "Profile" },
    { path: "/logout", label: "Logout" },
  ];

  // Links to display for guest users
  const guestLinks = [
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
  ];

  // Determine which links to display based on the user's authentication status
  const linksToDisplay = isLoggedIn ? authLinks : guestLinks;

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">
        <Link to="/">FilmHub</Link>
      </h2>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        {linksToDisplay.map((link) => (
          <li key={link.path}>
            <Link to={link.path} onClick={handleLinkClick}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
