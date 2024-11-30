import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CastAndCrews.css";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w200"; 

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [character, setCharacter] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (name && character && imageUrl) {
      const newActor = {
        userId: 1, 
        movieId: movieId,
        name,
        characterName: character,
        url: imageUrl,
      };
  
      try {
        setIsSubmitting(true);
        const response = await axios.post(
          `/admin/casts`,
          newActor,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
  
        console.log("Successfully added:", response.data);
  
        setCast((prevCast) => [...prevCast, { id: response.data.id, ...newActor }]);
        setName("");
        setCharacter("");
        setImageUrl("");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const fetchMovieCast = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(
        `/casts/${movieId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("API Response:", response.data);
  
      // Ensure response.data is an array and set it directly
      if (Array.isArray(response.data)) {
        setCast(response.data); // Directly set the array of actors
      } else {
        setError("Unexpected response format from the API.");
      }
    } catch (err) {
      console.error("API error:", err.response ? err.response.data : err.message);
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
    <div className="cast-container">
      <main className="cast-list">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {cast.length > 0 ? (
          <div>
            <h1>Cast</h1>
            <div className="scrollable-cast-list">
              <ul>
                {cast.map((actor, index) => (
                  <li key={actor.id || `${actor.name}-${actor.characterName}-${index}`} className="actor-item">
                    <img
                      src={
                        actor.url && actor.url.startsWith("http")
                          ? actor.url
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={actor.name}
                      className="actor-image"
                    />
                    <strong>{actor.name}</strong> as {actor.characterName}
                  </li>
                ))}
              </ul>

            </div>
          </div>
        ) : (
          <p>No cast data available.</p>
        )}
      </main>

      <aside className="cast-form">
        <h2>Add Cast Member</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Character:
            <input
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Actor"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default CastAndCrews;
