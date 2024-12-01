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

  // Initialize movieId and userId (Placeholders for now)
  const userId = 123;  // Replace this with actual dynamic logic for user ID
  const movieIdFromParam = movieId || 456;  // Replace this with actual dynamic logic for movie ID if needed

  const fetchMovieVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/videos/${movieIdFromParam}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setVideos(response.data || []);
    } catch (err) {
      setError("Failed to fetch movie videos.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedUrl = (key) => {
    return `https://www.youtube.com/embed/${key}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newVideo = {
      url,
      name,
      site,
      videoType,
      videoKey,
      official,
      movieId: movieIdFromParam, // Use initialized movieId here
      userId: userId,            // Use initialized userId here
    };

    try {
      setIsSubmitting(true);
      if (selectedVideo) {
        await axios.patch(`/videos/${selectedVideo.id}`, newVideo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("Video updated successfully.");
      } else {
        await axios.post("/videos", newVideo, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("New video added.");
      }

      // Refetch the video list after success
      fetchMovieVideos();

      // Reset form fields and switch to Add mode
      setUrl("");
      setName("");
      setSite("");
      setVideoType("");
      setVideoKey("");
      setOfficial(0);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error details:", error);
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
        await axios.delete(`/videos/${selectedVideo.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        alert("Video deleted successfully.");
        fetchMovieVideos(); // Refetch the video list after deletion
        setSelectedVideo(null); // Clear selected video
        setUrl("");
        setName("");
        setSite("");
        setVideoType("");
        setVideoKey("");
        setOfficial(0);
      } catch (error) {
        console.error("Error details:", error);
        alert("An error occurred while deleting the video.");
      }
    }
  };

  // Update the embedded URL whenever videoKey changes
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
          <button type="submit" className="save-button">
            {selectedVideo ? "Save" : "Add Video"}
          </button>
        </form>
        {selectedVideo && (
          <button onClick={handleDelete} className="delete-button">
            Delete Video
          </button>
        )}
      </div>
    </div>
  );
};

export default Videos;
