import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import "../styles/SearchView.css";

const SearchView = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("track");

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.search(searchQuery, searchType);
      setResults(response[searchType + "s"]?.items || []);
    } catch (error) {
      setError(error.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounced search
    if (value.trim()) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        handleSearch(value);
      }, 500);
    } else {
      setResults([]);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <div className="search-view">
      <div className="search-header">
        <h2>Search Music</h2>
        <p>Find tracks, artists, and albums</p>
      </div>

      <div className="search-controls">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search for music..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <div className="search-filters">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="track">Tracks</option>
            <option value="artist">Artists</option>
            <option value="album">Albums</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="search-results">
        {results.length > 0 && (
          <div className="results-header">
            <h3>Results ({results.length})</h3>
          </div>
        )}

        <div className="results-grid">
          {results.map((item) => (
            <div key={item.id} className="result-card">
              {item.images && item.images[0] && (
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="result-image"
                />
              )}
              {item.album && item.album.images && item.album.images[0] && (
                <img
                  src={item.album.images[0].url}
                  alt={item.name}
                  className="result-image"
                />
              )}

              <div className="result-info">
                <h4 className="result-title">{item.name}</h4>
                {item.artists && (
                  <p className="result-artist">
                    {item.artists.map((artist) => artist.name).join(", ")}
                  </p>
                )}
                {item.album && (
                  <p className="result-album">{item.album.name}</p>
                )}
                {item.duration_ms && (
                  <p className="result-duration">
                    {formatDuration(item.duration_ms)}
                  </p>
                )}
                {item.genres && item.genres.length > 0 && (
                  <p className="result-genres">
                    {item.genres.slice(0, 3).join(", ")}
                  </p>
                )}
                {item.followers && (
                  <p className="result-followers">
                    {item.followers.total.toLocaleString()} followers
                  </p>
                )}

                {item.preview_url && (
                  <audio controls className="result-audio">
                    <source src={item.preview_url} type="audio/mpeg" />
                  </audio>
                )}

                <a
                  href={item.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotify-link"
                >
                  <i className="fab fa-spotify"></i>
                  Open in Spotify
                </a>
              </div>
            </div>
          ))}
        </div>

        {query && results.length === 0 && !isLoading && !error && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No results found for "{query}"</p>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
