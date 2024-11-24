import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get route parameters
import axios from "axios";
import './Videos.css'

const TMDB_API_KEY = "497329e67f904395b79592a3c245314b";

const Videos = () => {
  const { movieId } = useParams(); // Get movieId from the URL parameters
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );
      setVideos(response.data.results || []);
    } catch (err) {
      setError("Failed to fetch movie videos. Please check the movie ID or API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieVideos();
    }
  }, [movieId]);

  return (
    <div className="App">
      <main>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {videos.length > 0 && (
          <div>
            <h2>Videos</h2>
            <ul>
              {videos.map((video) => (
                <li key={video.id}>
                  <h3>{video.name}</h3>
                  <iframe
                    title={video.name}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && !error && videos.length === 0 && <p>No videos available.</p>}
      </main>
    </div>
  );
};

export default Videos;
