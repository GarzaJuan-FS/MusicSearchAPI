import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

const RecommendationsView = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Get user's top tracks to use as seeds
        const topTracks = await apiService.getUserTop("tracks", "short_term");
        const seedTracks =
          topTracks.items?.slice(0, 2).map((track) => track.id) || [];

        const data = await apiService.getRecommendations(seedTracks);
        setRecommendations(data.tracks || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading)
    return <div className="loading">Getting recommendations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="recommendations-view">
      <h2>Recommended for You</h2>
      <p>Based on your listening history</p>

      <div className="recommendations-grid">
        {recommendations.map((track) => (
          <div key={track.id} className="recommendation-card">
            {track.album?.images?.[0] && (
              <img src={track.album.images[0].url} alt={track.name} />
            )}
            <div className="info">
              <h3>{track.name}</h3>
              <p>{track.artists?.map((artist) => artist.name).join(", ")}</p>
              <p>{track.album?.name}</p>
              {track.preview_url && (
                <audio controls>
                  <source src={track.preview_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsView;
