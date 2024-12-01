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
  const [selectedActor, setSelectedActor] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name && character && imageUrl) {
      const newActor = {
        userId: 2, // Replace with actual user ID
        movieId: movieId,
        name,
        characterName: character,
        url: imageUrl,
      };

      try {
        setIsSubmitting(true);
        if (selectedActor) {
          // Edit an existing actor
          console.log("Editing actor:", selectedActor.id);
          await axios.patch(
            `/admin/casts/${selectedActor.id}`, // Backend route
            newActor,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          alert("Cast updated successfully.");
        } else {
          // Add a new actor
          console.log("Adding new actor...");
          await axios.post(
            "/admin/casts",
            newActor,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          alert("New actor added.");
        }

        // Refetch the cast list after success
        await fetchMovieCast();

        // Clear the form fields and reset to Add mode
        setName("");
        setCharacter("");
        setImageUrl("");
        setSelectedActor(null); // Reset selected actor
      } catch (error) {
        console.error(
          "Error details:",
          error.response ? error.response.data : error.message
        );
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

  const handleEdit = (actor) => {
    setSelectedActor(actor);
    setName(actor.name);
    setCharacter(actor.characterName);
    setImageUrl(actor.url);
  };

  const handleDelete = async () => {
    if (selectedActor) {
      try {
        await axios.delete(`/admin/casts/${selectedActor.id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        alert("Actor deleted successfully.");
        await fetchMovieCast(); // Refetch the cast list after deletion
        setSelectedActor(null); // Clear selected actor
        setName("");
        setCharacter("");
        setImageUrl("");
      } catch (error) {
        console.error(
          "Error details:",
          error.response ? error.response.data : error.message
        );
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        alert(errorMessage);
      }
    }
  };

  const fetchMovieCast = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/casts/${movieId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Fetched Cast List:", response.data); // Log the fetched cast list
      if (Array.isArray(response.data)) {
        setCast(response.data); // Update the cast list with the fetched data
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
                  <li
                    key={actor.id || `${actor.name}-${actor.characterName}-${index}`}
                    className="actor-item"
                    onClick={() => handleEdit(actor)} // Set selected actor on click
                  >
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
        <h2>{selectedActor ? "Edit Cast Member" : "Add Cast Member"}</h2>
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
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : selectedActor ? "Save" : "Add Actor"}
          </button>
          {selectedActor && (
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </button>
          )}
        </form>
      </aside>
    </div>
  );
};

export default CastAndCrews;