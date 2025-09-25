require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Import our modules
const {
  verifyToken,
  generateJWT,
  getUserFromDB,
  saveUserToDB,
  validateJWTStatus,
  checkJWTStatus,
  autoRefreshToken,
} = require("./auth");
const {
  getSpotifyAuthURL,
  exchangeCodeForToken,
  getSpotifyUserProfile,
  searchSpotify,
  refreshAccessToken,
  getUserPlaylists,
  getPlaylistTracks,
  getUserTop,
  getRecentlyPlayed,
  getSpotifyItem,
  getArtistAlbums,
  getArtistTopTracks,
  getRecommendations,
} = require("./spotify");
const db = require("./database");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("MusicSearchAPI is running!");
});

// Serve test page
app.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

// Serve enhanced test page
app.get("/enhanced-test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "enhanced-test.html"));
});

// Auth routes
app.get("/auth/spotify", (req, res) => {
  const authURL = getSpotifyAuthURL();
  res.redirect(authURL);
});

app.get("/auth/spotify/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: "Authorization denied" });
  }

  try {
    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Get user profile
    const userProfile = await getSpotifyUserProfile(tokenData.access_token);

    // Save user to database
    const userData = {
      spotify_id: userProfile.id,
      display_name: userProfile.display_name,
      email: userProfile.email,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
    };

    await saveUserToDB(userData);

    // Generate JWT
    const jwt = generateJWT(userProfile.id, userProfile.id);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwt}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Logout route
app.post("/logout", verifyToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: "Logged out successfully" });
});

// ========================
// JWT VALIDATION ROUTES
// ========================

// Check JWT status without requiring authentication
app.get("/auth/status", checkJWTStatus, (req, res) => {
  res.json({
    authenticated: req.authStatus.valid,
    needsLogin: req.authStatus.needsLogin,
    tokenExpired: req.authStatus.tokenExpired,
    jwtExpired: req.authStatus.jwtExpired,
    reason: req.authStatus.reason,
  });
});

// Validate JWT and return detailed status
app.get("/auth/validate", validateJWTStatus, (req, res) => {
  res.json({
    valid: true,
    needsLogin: false,
    user: {
      id: req.userFromDB.spotify_id,
      display_name: req.userFromDB.display_name,
      email: req.userFromDB.email,
    },
    tokenExpired: req.tokenExpired,
  });
});

// Manual token refresh endpoint
app.post("/auth/refresh", validateJWTStatus, autoRefreshToken, (req, res) => {
  res.json({
    message: "Token refreshed successfully",
    tokenExpired: req.tokenExpired,
  });
});

// ========================
// CUSTOM SPOTIFY API ROUTES
// ========================

// Get user's playlists
app.get(
  "/api/playlists",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const playlists = await getUserPlaylists(
        req.userFromDB.access_token,
        limit,
        offset
      );
      res.json(playlists);
    } catch (error) {
      console.error("Get playlists error:", error);
      res.status(500).json({ error: "Failed to get playlists" });
    }
  }
);

// Get specific playlist tracks
app.get(
  "/api/playlists/:playlistId/tracks",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const { playlistId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      const tracks = await getPlaylistTracks(
        req.userFromDB.access_token,
        playlistId,
        limit
      );
      res.json(tracks);
    } catch (error) {
      console.error("Get playlist tracks error:", error);
      res.status(500).json({ error: "Failed to get playlist tracks" });
    }
  }
);

// Get user's top tracks or artists
app.get(
  "/api/top/:type",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const { type } = req.params; // 'tracks' or 'artists'
      const timeRange = req.query.time_range || "medium_term"; // short_term, medium_term, long_term
      const limit = parseInt(req.query.limit) || 20;

      if (!["tracks", "artists"].includes(type)) {
        return res
          .status(400)
          .json({ error: "Type must be 'tracks' or 'artists'" });
      }

      const topItems = await getUserTop(
        req.userFromDB.access_token,
        type,
        timeRange,
        limit
      );
      res.json(topItems);
    } catch (error) {
      console.error("Get top items error:", error);
      res.status(500).json({ error: `Failed to get top ${req.params.type}` });
    }
  }
);

// Get user's recently played tracks
app.get(
  "/api/recently-played",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;

      const recentTracks = await getRecentlyPlayed(
        req.userFromDB.access_token,
        limit
      );
      res.json(recentTracks);
    } catch (error) {
      console.error("Get recently played error:", error);
      res.status(500).json({ error: "Failed to get recently played tracks" });
    }
  }
);

// Get specific track/album/artist details
app.get(
  "/api/:type/:id",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const { type, id } = req.params;

      if (!["track", "album", "artist"].includes(type)) {
        return res
          .status(400)
          .json({ error: "Type must be 'track', 'album', or 'artist'" });
      }

      const item = await getSpotifyItem(req.userFromDB.access_token, type, id);
      res.json(item);
    } catch (error) {
      console.error("Get item error:", error);
      res
        .status(500)
        .json({ error: `Failed to get ${req.params.type} details` });
    }
  }
);

// Get artist's albums
app.get(
  "/api/artists/:artistId/albums",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const { artistId } = req.params;
      const limit = parseInt(req.query.limit) || 20;

      const albums = await getArtistAlbums(
        req.userFromDB.access_token,
        artistId,
        limit
      );
      res.json(albums);
    } catch (error) {
      console.error("Get artist albums error:", error);
      res.status(500).json({ error: "Failed to get artist albums" });
    }
  }
);

// Get artist's top tracks
app.get(
  "/api/artists/:artistId/top-tracks",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const { artistId } = req.params;
      const market = req.query.market || "US";

      const topTracks = await getArtistTopTracks(
        req.userFromDB.access_token,
        artistId,
        market
      );
      res.json(topTracks);
    } catch (error) {
      console.error("Get artist top tracks error:", error);
      res.status(500).json({ error: "Failed to get artist top tracks" });
    }
  }
);

// Get music recommendations
app.get(
  "/api/recommendations",
  validateJWTStatus,
  autoRefreshToken,
  async (req, res) => {
    try {
      const {
        seed_artists,
        seed_tracks,
        seed_genres,
        limit = 20,
        market = "US",
        ...audioFeatures
      } = req.query;

      if (!seed_artists && !seed_tracks && !seed_genres) {
        return res.status(400).json({
          error:
            "At least one seed parameter is required (seed_artists, seed_tracks, or seed_genres)",
        });
      }

      const params = {
        seed_artists,
        seed_tracks,
        seed_genres,
        limit: parseInt(limit),
        market,
        ...audioFeatures,
      };

      const recommendations = await getRecommendations(
        req.userFromDB.access_token,
        params
      );
      res.json(recommendations);
    } catch (error) {
      console.error("Get recommendations error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  }
);

// Enhanced search with auto-refresh
app.get("/search", validateJWTStatus, autoRefreshToken, async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || "track";
  const limit = parseInt(req.query.limit) || 20;

  if (!query) {
    return res
      .status(400)
      .json({ error: "Missing search query parameter 'q'" });
  }

  try {
    const searchResults = await searchSpotify(
      req.userFromDB.access_token,
      query,
      type,
      limit
    );
    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Get current user profile (enhanced)
app.get("/me", validateJWTStatus, autoRefreshToken, async (req, res) => {
  try {
    // Get fresh profile data from Spotify
    const spotifyProfile = await getSpotifyUserProfile(
      req.userFromDB.access_token
    );

    res.json({
      id: spotifyProfile.id,
      display_name: spotifyProfile.display_name,
      email: spotifyProfile.email,
      images: spotifyProfile.images,
      followers: spotifyProfile.followers,
      country: spotifyProfile.country,
      product: spotifyProfile.product,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
