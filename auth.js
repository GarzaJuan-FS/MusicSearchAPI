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

module.exports = {
  generateJWT,
  verifyToken,
  getUserFromDB,
  saveUserToDB,
};
