require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("MusicSearchAPI is running!");
});

// Basic search route (stub)
app.get("/search", (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res
      .status(400)
      .json({ error: "Missing search query parameter 'q'" });
  }
  // This is a stub. Integrate Spotify API here.
  res.json({ message: `Search for: ${query}` });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
