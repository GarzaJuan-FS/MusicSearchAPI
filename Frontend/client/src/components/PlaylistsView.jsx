import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

const PlaylistsView = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await apiService.getUserPlaylists();
        setPlaylists(data.items || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (isLoading) return <div className="loading">Loading playlists...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="playlists-view">
      <h2>Your Playlists</h2>
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            {playlist.images?.[0] && (
              <img src={playlist.images[0].url} alt={playlist.name} />
            )}
            <h3>{playlist.name}</h3>
            <p>{playlist.tracks.total} tracks</p>
            <p>{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsView;
