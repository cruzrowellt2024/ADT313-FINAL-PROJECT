import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Images.css'

const Images = () => {
  const { movieId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = "2"; 
  const movieIdFromParams = movieId;

  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/admin/photos/${movieIdFromParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setImages(response.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch movie images.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newImage = {
      userId,
      movieId: movieIdFromParams,
      url,
      description,
    };

    try {
      setIsSubmitting(true);
      if (selectedImage) {
        await axios.patch(`/photos/${selectedImage.id}`, newImage, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("Image updated successfully.");
      } else {
        await axios.post("/photos", newImage, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("New image added.");
      }

      fetchImages();

      setUrl("");
      setDescription("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error details:", error);
      alert("An error occurred while saving the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setUrl(image.url);
    setDescription(image.description);
  };

  const handleDelete = async () => {
    if (selectedImage) {
      try {
        await axios.delete(`/photos/${selectedImage.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        alert("Image deleted successfully.");
        fetchImages(); 
        setSelectedImage(null); 
        setUrl("");
        setDescription("");
      } catch (error) {
        console.error("Error details:", error);
        alert("An error occurred while deleting the image.");
      }
    }
  };

  useEffect(() => {
    if (movieIdFromParams) {
      fetchImages();
    }
  }, [movieIdFromParams]);

  return (
    <div className="image-container">
      <div className="image-table-container">
        <h1>Image List</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && images.length === 0 && <p>No images available.</p>}
        <table className="image-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr
                key={image.id}
                className="image-item"
                onClick={() => handleEdit(image)}
              >
                <td>{image.url}</td>
                <td>{image.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="image-form">
        <h2>{selectedImage ? "Edit Image" : "Add Image"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="save-button">
            {selectedImage ? "Save" : "Add Image"}
          </button>
        </form>
        {selectedImage && (
          <button onClick={handleDelete} className="delete-button">
            Delete Image
          </button>
        )}
      </div>
    </div>
  );
};

export default Images;
