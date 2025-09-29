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

// Get user's playlists
const getUserPlaylists = async (accessToken, limit = 20, offset = 0) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
          offset,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get user playlists");
  }
};

// Get playlist tracks
const getPlaylistTracks = async (accessToken, playlistId, limit = 50) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get playlist tracks");
  }
};

// Get user's top tracks/artists
const getUserTop = async (
  accessToken,
  type = "tracks",
  timeRange = "medium_term",
  limit = 20
) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/${type}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: timeRange, // short_term, medium_term, long_term
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user's top ${type}`);
  }
};

// Get user's recently played tracks
const getRecentlyPlayed = async (accessToken, limit = 20) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get recently played tracks");
  }
};

// Get track/album/artist details
const getSpotifyItem = async (accessToken, itemType, itemId) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/${itemType}s/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get ${itemType} details`);
  }
};

// Get artist's albums
const getArtistAlbums = async (accessToken, artistId, limit = 20) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          include_groups: "album,single",
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get artist albums");
  }
};

// Get artist's top tracks
const getArtistTopTracks = async (accessToken, artistId, market = "US") => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          market,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get artist top tracks");
  }
};

// Get recommendations
const getRecommendations = async (accessToken, params) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to get recommendations");
  }
};

module.exports = {
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
};
