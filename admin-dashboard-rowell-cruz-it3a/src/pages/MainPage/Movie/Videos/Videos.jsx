import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Videos.css";

const Videos = () => {
  const { movieId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [videoType, setVideoType] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [official, setOfficial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = 2;
  const movieIdFromParam = movieId;

  const fetchMovieVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/videos/${movieIdFromParam}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch movie videos.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setName("");
    setSite("");
    setVideoType("");
    setVideoKey("");
    setOfficial(0);
    setSelectedVideo(null);
  };  

  const generateEmbedUrl = (key) => {
    return `https://www.youtube.com/embed/${key}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!url || !name || !site || !videoType || !videoKey) {
      alert("All fields are required.");
      return;
    }
  
    const videoPayload = {
      movieId: movieIdFromParam, // Ensure it's passed correctly here
      userId,
      url,
      name,
      site,
      videoType,
      videoKey,
      official,
    };
  
    try {
      setIsSubmitting(true);
  
      if (selectedVideo) {
        // PATCH request for updating video
        const response = await axios.patch(
          `/admin/videos/${selectedVideo.id}`,
          videoPayload,  // Directly pass videoPayload to match backend expectations
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Update response:", response.data);
        alert("Video updated successfully.");
      } else {
        // POST request for creating a new video
        const response = await axios.post(
          "/videos",
          videoPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Create response:", response.data);
        alert("New video added successfully.");
      }
  
      fetchMovieVideos(); // Refresh the video list
      resetForm();
    } catch (error) {
      console.error("Error details:", error.response || error.message);
      alert("An error occurred while saving the video.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (video) => {
    setSelectedVideo(video);
    setUrl(video.url);
    setName(video.name);
    setSite(video.site);
    setVideoType(video.videoType);
    setVideoKey(video.videoKey);
    setOfficial(video.official);
  };

  const handleDelete = async () => {
    if (selectedVideo) {
      try {
        await axios.delete(`/admin/videos/${selectedVideo.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("Video deleted successfully.");
        fetchMovieVideos();
        resetForm();
      } catch (error) {
        console.error("Error details:", error);
        alert("An error occurred while deleting the video.");
      }
    }
  };

  useEffect(() => {
    if (videoKey) {
      setUrl(generateEmbedUrl(videoKey));
    }
  }, [videoKey]);

  useEffect(() => {
    if (movieIdFromParam) {
      fetchMovieVideos();
    }
  }, [movieIdFromParam]);

  return (
    <div className="video-container">
      <div className="video-table-container">
        <h1>Video List</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && videos.length === 0 && <p>No videos available.</p>}
        <table className="video-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr
                key={video.id}
                className="video-item"
                onClick={() => handleEdit(video)}
              >
                <td>{video.id}</td>
                <td>{`https://www.youtube.com/embed/${video.key}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="video-form">
        <h2>{selectedVideo ? "Edit Video" : "Add Video"}</h2>
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
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Site:
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              required
            />
          </label>
          <label>
            Video Type:
            <input
              type="text"
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              required
            />
          </label>
          <label>
            Video Key:
            <input
              type="text"
              value={videoKey}
              onChange={(e) => setVideoKey(e.target.value)}
              required
            />
          </label>
          <label>
            Official:
            <select
              value={official}
              onChange={(e) => setOfficial(Number(e.target.value))}
            >
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {selectedVideo ? "Save" : "Add Video"}
          </button>
        </form>
        {selectedVideo && (
          <button onClick={handleDelete} className="delete-button" disabled={isSubmitting}>
            Delete Video
          </button>
        )}
      </div>
    </div>
  );
};

export default Videos;