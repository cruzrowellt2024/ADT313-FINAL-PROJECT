import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CastAndCrews.css";

const TMDB_API_KEY = "497329e67f904395b79592a3c245314b";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w200"; // URL for fetching images

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieCast = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );
      setCast(response.data.cast || []);
    } catch (err) {
      setError("Failed to fetch movie credits. Please check the movie ID or API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieCast();
    }
  }, [movieId]);

  return (
    <div className="App">
      <main>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {cast.length > 0 && (
          <div>
            <h2>Cast</h2>
            <ul>
              {cast.map((actor) => (
                <li key={actor.id}>
                  {actor.profile_path ? (
                    <img
                      src={`${TMDB_IMAGE_URL}${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-image"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/200x300?text=No+Image"
                      alt="No Image"
                      className="actor-image"
                    />
                  )}
                  <strong>{actor.name}</strong> as {actor.character}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && !error && cast.length === 0 && <p>No cast data available.</p>}
      </main>
    </div>
  );
};

export default CastAndCrews;
