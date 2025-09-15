import React, { useState } from "react"; // ✅ import useState
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import avatarImg from "../assets/avatar.png";

const Header = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ determine active based on current path
  const isProfileActive = location.pathname === "/profile";

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="global-header">
      <div className="header-left">
        <h1 className="brand-name">RentAll</h1>
        <nav className="header-nav">
          <button
            className={`nav-tab ${location.pathname === "/home" ? "active" : ""}`}
            onClick={() => handleNavigation("/home")}
          >
            Home
          </button>
          <button
            className={`nav-tab ${location.pathname === "/inbox" ? "active" : ""}`}
            onClick={() => handleNavigation("/inbox")}
          >
            Inbox
          </button>
          <button
            className={`nav-tab ${location.pathname === "/notifications" ? "active" : ""}`}
            onClick={() => handleNavigation("/notifications")}
          >
            Notifications
          </button>
        </nav>
      </div>

      <div className="header-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        <button className="favorites-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button
          className={`profile-button ${isProfileActive ? "active" : ""}`}
          onClick={() => handleNavigation("/profile")}
        >
          <img src={avatarImg} alt="Profile" className="profile-avatar" />
        </button>
      </div>
    </header>
  );
};

export default Header;