import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Photos.css';
import { useUserContext } from "../../../../context/UserContext";

const Photos = () => {
  const { movieId } = useParams();
  const [ movie, setMovie] = useState([]);
  const { userId, accessToken } = useUserContext();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState('');
  const [description, setDescription] = useState("");
  const [editPhotoId, setEditPhotoId] = useState(null);

  const tmdbApiKey = "497329e67f904395b79592a3c245314b"; 

  const handleImport = async () => {
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${tmdbApiKey}`;
  
    if (!window.confirm("Are you sure you want to import images from TMDB?")) {
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await axios.get(tmdbEndpoint);
      const tmdbImages = response.data.posters || [];
  
      if (tmdbImages.length === 0) {
        alert("No images found on TMDB for this movie.");
        return;
      }
  
      const mappedImages = tmdbImages.map((image) => ({
        movieId: movieId,
        userId,
        url: `https://image.tmdb.org/t/p/w500${image.file_path}`, 
        description: image.description || "No description available", 
      }));
  
      await Promise.all(
        mappedImages.map(async (imagePayload) => {
          await axios.post("/photos", imagePayload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        })
      );
  
      alert("Images imported successfully.");
      await fetchPhotos();
    } catch (err) {
      console.error("Error importing images:", err.response || err.message);
      alert("Failed to import images from TMDB.");
    } finally {
      setLoading(false);
    }
  };

  const getMovies = async () => {
    try {
      const response = await axios.get(`/movies/${movieId}`);
      setMovie(response.data);
    } catch (err) {
      console.error("Error fetching movie data:", err);
    }
  };
  
  
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/photos/${movieId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data && response.data.id) {
        setPhotos([response.data]);
      } else {
        console.error("API response does not contain valid image data.");
      }
      console.log(response.data.message);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photoUrl && description) {
      const newPhoto = { userId: userId, movieId: movieId, description: description, url: photoUrl};

      try {
        const response = editing
          ? await axios.patch(`/photos/${editPhotoId}`, newPhoto, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            })
          : await axios.post('/photos', newPhoto, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            });

        console.log('Photo saved successfully:', response.data);
        alert(editing ? "Photo updated." : "New photo added.");
        
      } catch (error) {
        console.error('Error saving photo:', error);
      } finally {
        resetForm();
      }
    }
  };
  
  const handleEdit = async (selectedId, selectedUrl, selectedDescription) => {
    setEditPhotoId(selectedId);
    setPhotoUrl(selectedUrl);
    setDescription(selectedDescription);
    setEditing(true);
  };
  
  const handleDelete = async (id) => {
    if (id) {
      try {
        const response = await axios.delete(`/photos/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("Photo deleted successfully.");
        resetForm();
      } catch (error) {
        console.error("Error details:", error);
        alert("An error occurred while deleting the photo.");
      } finally {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    fetchPhotos();
    getMovies();
    setEditPhotoId(null);
    setPhotoUrl("");
    setDescription("");
    setPhotoPreview("");
    setEditing(false);
  };

  useEffect(() => {
    if (movieId) {
      fetchPhotos();
      getMovies();
    }
  }, [movieId]);

  useEffect(() => {
    if (photoUrl) {
      if (typeof photoUrl === 'string' && photoUrl.startsWith("http")) {
        setPhotoPreview(photoUrl);
      } else if (photoUrl instanceof File) {
        const previewUrl = URL.createObjectURL(photoUrl);
        setPhotoPreview(previewUrl);
      }
    }
  }, [photoUrl]);

  return (
    <div className="photos">
      <h1>Photos</h1>
      <div className="horizontal-container">
        {loading && <p>Loading...</p>}
        <div className="photo-list-container">
          <div>
              <table className="photo-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {movie.photos && movie.photos.length > 0 ? (
                <tbody>
                  {movie.photos.map((photo, index) => (
                    <tr key={index}>
                      <td>{photo.id}</td>
                      <td>{photo.description || "No description"}</td>
                      <td>
                        <button
                          className="edit-photo-button"
                          onClick={() => handleEdit(photo.id, photo.url, photo.description)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-photo-button"
                          onClick={() => handleDelete(photo.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            ) : (
              <></>
            )}
              </table>
          </div>
        </div>

        <div className="photo-form-container">
          <h2>{editing ? "Edit Photo" : "Add Photo"}</h2>

          <form onSubmit={handleSubmit} className="photo-form">
            <div className="image-preview-container">
              <label>Image Preview:</label>
              <img
                src={photoPreview || "https://via.placeholder.com/200x300?text=No+Image"}
                alt="Cast Preview"
                className="image-preview"
                onError={(e) => e.target.src = "https://via.placeholder.com/200x300?text=No+Image"}
              />
            </div>
            
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="text"
                value={photoUrl || ""}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Enter image url"
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-button">
                {editing ? "Save Photo" : "Add Photo"}
              </button>
              {!editing && (
                <button type="button" className="save-button" onClick={handleImport}>
                  Import from TMDB
                </button>
              )}
              {editing && (
                <button type="button" className="save-button" onClick={resetForm}>
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

export default Photos;