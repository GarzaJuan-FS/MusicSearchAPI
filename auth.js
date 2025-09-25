const jwt = require("jsonwebtoken");
const db = require("./database");

// Generate JWT token
const generateJWT = (userId, spotifyId) => {
  return jwt.sign({ userId, spotifyId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get user from database
const getUserFromDB = (spotifyId) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE spotify_id = ?",
      [spotifyId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

// Save or update user in database
const saveUserToDB = (userData) => {
  return new Promise((resolve, reject) => {
    const {
      spotify_id,
      display_name,
      email,
      access_token,
      refresh_token,
      expires_in,
    } = userData;

    const token_expires_at = Date.now() + expires_in * 1000;

    db.run(
      `INSERT OR REPLACE INTO users 
       (spotify_id, display_name, email, access_token, refresh_token, token_expires_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        spotify_id,
        display_name,
        email,
        access_token,
        refresh_token,
        token_expires_at,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// Enhanced JWT validation with database check
const validateJWTStatus = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      valid: false,
      needsLogin: true,
      error: "No token provided",
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in database
    const user = await getUserFromDB(decoded.spotifyId);

    if (!user) {
      return res.status(401).json({
        valid: false,
        needsLogin: true,
        error: "User not found in database",
      });
    }

    // Check if Spotify access token has expired
    const now = Date.now();
    const tokenExpired = now > user.token_expires_at;

    req.user = decoded;
    req.userFromDB = user;
    req.tokenExpired = tokenExpired;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        valid: false,
        needsLogin: false,
        error: "JWT token expired",
        jwtExpired: true,
      });
    }

    return res.status(401).json({
      valid: false,
      needsLogin: true,
      error: "Invalid JWT token",
    });
  }
};

// Middleware to check JWT status without blocking request
const checkJWTStatus = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.authStatus = {
      valid: false,
      needsLogin: true,
      reason: "No token provided",
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserFromDB(decoded.spotifyId);

    if (!user) {
      req.authStatus = {
        valid: false,
        needsLogin: true,
        reason: "User not found",
      };
      return next();
    }

    const tokenExpired = Date.now() > user.token_expires_at;

    req.authStatus = {
      valid: true,
      needsLogin: false,
      tokenExpired,
      user: decoded,
    };
    req.userFromDB = user;

    next();
  } catch (error) {
    req.authStatus = {
      valid: false,
      needsLogin: error.name === "TokenExpiredError" ? false : true,
      reason: error.message,
      jwtExpired: error.name === "TokenExpiredError",
    };
    next();
  }
};

// Auto-refresh middleware - automatically refreshes tokens when needed
const autoRefreshToken = async (req, res, next) => {
  if (!req.userFromDB || !req.tokenExpired) {
    return next();
  }

  try {
    const { refreshAccessToken } = require("./spotify");
    const newTokenData = await refreshAccessToken(req.userFromDB.refresh_token);

    // Update user in database
    await saveUserToDB({
      spotify_id: req.userFromDB.spotify_id,
      display_name: req.userFromDB.display_name,
      email: req.userFromDB.email,
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || req.userFromDB.refresh_token,
      expires_in: newTokenData.expires_in,
    });

    // Update request with new token
    req.userFromDB.access_token = newTokenData.access_token;
    req.tokenExpired = false;

    next();
  } catch (error) {
    console.error("Auto refresh failed:", error);
    return res.status(401).json({
      valid: false,
      needsLogin: true,
      error: "Token refresh failed - please re-authenticate",
    });
  }
};

module.exports = {
  generateJWT,
  verifyToken,
  validateJWTStatus,
  checkJWTStatus,
  autoRefreshToken,
  getUserFromDB,
  saveUserToDB,
};
