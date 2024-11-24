import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TMDB_API_KEY = "497329e67f904395b79592a3c245314b";

const Images = () => {
  const { movieId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/images`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );
      setImages(response.data.backdrops || []);
    } catch (err) {
      setError("Failed to fetch movie images. Please check the movie ID or API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieImages();
    }
  }, [movieId]);

  return (
    <div className="App">
      <main>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {images.length > 0 && (
          <div>
            <h2>Images</h2>
            <div className="image-gallery">
              {images.map((image) => (
                <div key={image.file_path} className="image-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                    alt="Movie"
                    width="500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && !error && images.length === 0 && <p>No images available.</p>}
      </main>
    </div>
  );
};

export default Images;
