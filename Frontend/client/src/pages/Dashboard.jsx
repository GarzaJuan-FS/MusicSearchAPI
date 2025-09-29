import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import SearchView from "../components/SearchView";
import PlaylistsView from "../components/PlaylistsView";
import TopMusicView from "../components/TopMusicView";
import RecommendationsView from "../components/RecommendationsView";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState("search");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "search":
        return <SearchView />;
      case "playlists":
        return <PlaylistsView />;
      case "top-music":
        return <TopMusicView />;
      case "recommendations":
        return <RecommendationsView />;
      default:
        return <SearchView />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <i className="fab fa-spotify spotify-icon"></i>
            <h1>Music Search</h1>
          </div>

          <div className="user-section">
            <div className="user-info">
              <span>Welcome, {user?.display_name || "User"}!</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button
            className={`nav-btn ${currentView === "search" ? "active" : ""}`}
            onClick={() => setCurrentView("search")}
          >
            <i className="fas fa-search"></i>
            Search
          </button>
          <button
            className={`nav-btn ${currentView === "playlists" ? "active" : ""}`}
            onClick={() => setCurrentView("playlists")}
          >
            <i className="fas fa-list"></i>
            Playlists
          </button>
          <button
            className={`nav-btn ${currentView === "top-music" ? "active" : ""}`}
            onClick={() => setCurrentView("top-music")}
          >
            <i className="fas fa-star"></i>
            Top Music
          </button>
          <button
            className={`nav-btn ${
              currentView === "recommendations" ? "active" : ""
            }`}
            onClick={() => setCurrentView("recommendations")}
          >
            <i className="fas fa-magic"></i>
            Recommendations
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="main-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
