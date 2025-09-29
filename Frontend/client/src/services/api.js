import axios from "axios";

const API_BASE_URL = import.meta.env.DEV ? "/api" : "";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("spotifyToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("spotifyToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  async checkTokenStatus() {
    try {
      const response = await api.get("/token-status");
      return response.data;
    } catch (error) {
      throw new Error("Failed to check token status");
    }
  },

  async logout() {
    try {
      await api.post("/logout");
      localStorage.removeItem("spotifyToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Search
  async search(query, type = "track") {
    try {
      const response = await api.get("/search", {
        params: { q: query, type },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `Search failed: ${error.response?.data?.error || error.message}`
      );
    }
  },

  // User Data
  async getUserProfile() {
    try {
      const response = await api.get("/user-profile");
      return response.data;
    } catch (error) {
      throw new Error("Failed to get user profile");
    }
  },

  async getUserPlaylists() {
    try {
      const response = await api.get("/user-playlists");
      return response.data;
    } catch (error) {
      throw new Error("Failed to get playlists");
    }
  },

  async getPlaylistTracks(playlistId) {
    try {
      const response = await api.get(`/playlist-tracks/${playlistId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get playlist tracks");
    }
  },

  async getUserTop(type = "tracks", timeRange = "medium_term") {
    try {
      const response = await api.get("/user-top", {
        params: { type, time_range: timeRange },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to get top music");
    }
  },

  async getRecommendations(seedTracks = [], seedArtists = [], seedGenres = []) {
    try {
      const response = await api.get("/recommendations", {
        params: {
          seed_tracks: seedTracks.join(","),
          seed_artists: seedArtists.join(","),
          seed_genres: seedGenres.join(","),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to get recommendations");
    }
  },

  async getRecentlyPlayed() {
    try {
      const response = await api.get("/recently-played");
      return response.data;
    } catch (error) {
      throw new Error("Failed to get recently played");
    }
  },
};

export default apiService;
