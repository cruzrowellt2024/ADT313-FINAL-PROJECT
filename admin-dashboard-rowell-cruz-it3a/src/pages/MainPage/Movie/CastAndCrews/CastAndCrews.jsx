import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './CastAndCrews.css';

const CastsAndCrews = () => {
  const [casts, setCasts] = useState([]); 
  const { movieId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [castName, setCastName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editCastId, setEditCastId] = useState(null);

  const tmdbApiKey = "497329e67f904395b79592a3c245314b"; 

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/search/person`, {
        params: {
          api_key: tmdbApiKey,
          query: searchQuery,
        },
      });
      console.log("TMDB Search Results:", response.data);
      
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
  
        setCastName(firstResult.name); 
        setCharacterName(firstResult.known_for_department); 
        setImageUrl(`https://image.tmdb.org/t/p/w500${firstResult.profile_path}`); 
        setImagePreview(`https://image.tmdb.org/t/p/w500${firstResult.profile_path}`);
        
      } else {
        setError("No results found from TMDB.");
      }
    } catch (err) {
      console.error("TMDB API error:", err.message);
      setError("Failed to fetch from TMDB.");
    } finally {
      setLoading(false);
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
      console.log("Fetched Cast List:", response.data);
      if (Array.isArray(response.data)) {
        setCasts(response.data);
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
  
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (castName && characterName && imageUrl) {
      const newActor = {
        userId: 2, 
        movieId: movieId,
        name: castName,
        characterName: characterName,
        url: imageUrl,
      };
        
      try {
        const response = editing
          ? await axios.patch(`/admin/casts/${editCastId}`, newActor, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
          : await axios.post('/admin/casts', newActor, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });

        console.log('Cast saved successfully:', response.data);
        alert(editing ? "Cast updated." : "New actor added.");
        
        await fetchMovieCast();
        await handleCancel();
      } catch (error) {
        await fetchMovieCast();
        await handleCancel();
        console.error('Error saving cast:', error);
      }
    }
  };

  const handleEdit = (id) => {
    const castToEdit = casts.find(cast => cast.id === id);
    if (castToEdit) {
      setCastName(castToEdit.name);
      setCharacterName(castToEdit.characterName);
      setImageUrl(castToEdit.url);
      setImagePreview(castToEdit.url);
      setEditing(true);
      setEditCastId(id);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this cast?");
    if (isConfirmed) {
      try {
        setLoading(true);
  
        const response = await axios.delete(`/admin/casts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        
        console.log("Cast deleted successfully:", response.data);
        alert("Cast deleted successfully.");
        
        await fetchMovieCast();
      } catch (error) {
        console.error("Error deleting cast:", error);
        await fetchMovieCast();
        await handleCancel();
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCancel = () => {
    setCastName('');
    setCharacterName('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setEditing(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieCast();
    }
  }, [movieId]);

  useEffect(() => {
    if (imageUrl) {
      if (typeof imageUrl === 'string' && imageUrl.startsWith("http")) {
        setImagePreview(imageUrl);
      } else if (imageUrl instanceof File) {
        const previewUrl = URL.createObjectURL(imageUrl);
        setImagePreview(previewUrl);
      }
    }
  }, [imageUrl]);
  

  return (
    <div className="cast-and-crews">
      <h1>Cast and Crews</h1>
      <div className="horizontal-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {casts.length > 0 ? (
        <div className="cast-list-container">
          <table className="cast-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Character</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {casts.map(cast => (
                <tr key={cast.id}>
                  <td>{cast.id}</td>
                  <td>{cast.name}</td>
                  <td>{cast.characterName}</td>
                  <td>
                    <button className="edit-cast-button" onClick={() => handleEdit(cast.id)}>Edit</button>
                    <button className="delete-cast-button" onClick={() => handleDelete(cast.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <p>No cast data available.</p>
        )}

        <div className="cast-form-container">
          <h2>{editing ? "Edit Cast" : "Add Cast"}</h2>
          
          {!editing && (
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search cast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="cast-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={castName}
                onChange={(e) => setCastName(e.target.value)}
                placeholder="Enter cast name"
                required
              />
            </div>

            <div className="form-group">
              <label>Character:</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name"
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="image-preview-container">
              <label>Image Preview:</label>
              <img
                src={imagePreview || "https://via.placeholder.com/200x300?text=No+Image"}
                alt="Cast Preview"
                className="image-preview"
                onError={(e) => e.target.src = "https://via.placeholder.com/200x300?text=No+Image"}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-button">
                {editing ? "Save Cast" : "Add Cast"}
              </button>
              {editing && (
                <button type="button" className="save-button" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CastsAndCrews;