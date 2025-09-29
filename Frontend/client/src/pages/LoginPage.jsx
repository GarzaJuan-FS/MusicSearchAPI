import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const { isAuthenticated, loading, getSpotifyAuthUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login button clicked!");
    const authUrl = getSpotifyAuthUrl();
    console.log("Auth URL:", authUrl);
    console.log("Redirecting to Spotify...");

    // Add a small delay to ensure console logs are visible
    setTimeout(() => {
      window.location.href = authUrl;
    }, 100);
  };

  if (loading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="spotify-logo">
            <i className="fab fa-spotify"></i>
          </div>
          <h1>Spotify Music Search</h1>
          <p>
            Discover your music, explore new tracks, and manage your playlists
          </p>
        </div>

        <div className="login-content">
          <div className="login-features">
            <div className="feature">
              <i className="fas fa-search"></i>
              <h3>Search Music</h3>
              <p>Find any track, artist, or album in Spotify's vast library</p>
            </div>
            <div className="feature">
              <i className="fas fa-music"></i>
              <h3>Your Top Music</h3>
              <p>See your most played tracks and artists</p>
            </div>
            <div className="feature">
              <i className="fas fa-list"></i>
              <h3>Your Playlists</h3>
              <p>Browse and explore your personal playlists</p>
            </div>
            <div className="feature">
              <i className="fas fa-magic"></i>
              <h3>Recommendations</h3>
              <p>Get personalized music recommendations</p>
            </div>
          </div>

          <div className="login-actions">
            <button
              type="button"
              className="spotify-login-btn"
              onClick={handleLogin}
            >
              <i className="fab fa-spotify"></i>
              Login with Spotify
            </button>
            <p className="login-disclaimer">
              You'll be redirected to Spotify to authorize this application
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2025 Spotify Music Search App</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
