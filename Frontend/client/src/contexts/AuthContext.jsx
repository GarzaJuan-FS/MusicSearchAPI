import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("spotifyToken");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Check token status with backend
      const tokenStatus = await apiService.checkTokenStatus();

      if (tokenStatus.valid) {
        setIsAuthenticated(true);
        // Get user profile
        const profile = await apiService.getUserProfile();
        setUser(profile);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("spotifyToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("spotifyToken");
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("spotifyToken", token);
    checkAuth();
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("spotifyToken");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const getSpotifyAuthUrl = () => {
    const url = "http://127.0.0.1:8888/login";
    console.log("Generated auth URL:", url);
    return url;
  };

  useEffect(() => {
    // Check for token in URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      login(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      checkAuth();
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getSpotifyAuthUrl,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
