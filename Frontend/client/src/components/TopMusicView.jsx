import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

const TopMusicView = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentTab, setCurrentTab] = useState("tracks");
  const [timeRange, setTimeRange] = useState("medium_term");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopMusic = async () => {
      try {
        setIsLoading(true);
        const [tracksData, artistsData] = await Promise.all([
          apiService.getUserTop("tracks", timeRange),
          apiService.getUserTop("artists", timeRange),
        ]);
        setTopTracks(tracksData.items || []);
        setTopArtists(artistsData.items || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopMusic();
  }, [timeRange]);

  if (isLoading)
    return <div className="loading">Loading your top music...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const currentData = currentTab === "tracks" ? topTracks : topArtists;

  return (
    <div className="top-music-view">
      <h2>Your Top Music</h2>

      <div className="controls">
        <div className="tabs">
          <button
            className={currentTab === "tracks" ? "active" : ""}
            onClick={() => setCurrentTab("tracks")}
          >
            Top Tracks
          </button>
          <button
            className={currentTab === "artists" ? "active" : ""}
            onClick={() => setCurrentTab("artists")}
          >
            Top Artists
          </button>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">All time</option>
        </select>
      </div>

      <div className="top-music-grid">
        {currentData.map((item, index) => (
          <div key={item.id} className="top-music-card">
            <span className="rank">#{index + 1}</span>
            {(item.images || item.album?.images)?.[0] && (
              <img
                src={(item.images || item.album.images)[0].url}
                alt={item.name}
              />
            )}
            <div className="info">
              <h3>{item.name}</h3>
              {item.artists && (
                <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
              )}
              {item.genres && item.genres.length > 0 && (
                <p>{item.genres.slice(0, 2).join(", ")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMusicView;
