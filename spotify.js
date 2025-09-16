const axios = require("axios");
const querystring = require("querystring");

// Generate Spotify authorization URL
const getSpotifyAuthURL = () => {
  const scope =
    "user-read-private user-read-email playlist-read-private playlist-read-collaborative";

  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: generateRandomString(16),
  };

  return (
    "https://accounts.spotify.com/authorize?" + querystring.stringify(params)
  );
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to exchange code for token");
  }
};

// Get user profile from Spotify
const getSpotifyUserProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to get user profile");
  }
};

// Search Spotify
const searchSpotify = async (
  accessToken,
  query,
  type = "track",
  limit = 20
) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: type,
        limit: limit,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to search Spotify");
  }
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to refresh access token");
  }
};

// Generate random string for state parameter
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = {
  getSpotifyAuthURL,
  exchangeCodeForToken,
  getSpotifyUserProfile,
  searchSpotify,
  refreshAccessToken,
};
