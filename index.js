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
} = require("./auth");
const {
  getSpotifyAuthURL,
  exchangeCodeForToken,
  getSpotifyUserProfile,
  searchSpotify,
  refreshAccessToken,
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

// Protected search route
app.get("/search", verifyToken, async (req, res) => {
  const query = req.query.q;
  const type = req.query.type || "track";

  if (!query) {
    return res
      .status(400)
      .json({ error: "Missing search query parameter 'q'" });
  }

  try {
    // Get user from database
    const user = await getUserFromDB(req.user.spotifyId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if token needs refresh
    if (Date.now() > user.token_expires_at) {
      const newTokenData = await refreshAccessToken(user.refresh_token);

      // Update user in database
      await saveUserToDB({
        spotify_id: user.spotify_id,
        display_name: user.display_name,
        email: user.email,
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token || user.refresh_token,
        expires_in: newTokenData.expires_in,
      });

      user.access_token = newTokenData.access_token;
    }

    // Search Spotify
    const searchResults = await searchSpotify(user.access_token, query, type);
    res.json(searchResults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Get current user profile
app.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await getUserFromDB(req.user.spotifyId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.spotify_id,
      display_name: user.display_name,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Logout route
app.post("/logout", verifyToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: "Logged out successfully" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
