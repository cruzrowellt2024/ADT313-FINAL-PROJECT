import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../../../../context/UserContext";
import "./Videos.css";

const Videos = () => {
  const { movieId } = useParams();
  const { userId, accessToken } = useUserContext();
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
  const [editing, setEditing] = useState(false);

  const tmdbApiKey = "497329e67f904395b79592a3c245314b"; 

  const fetchMovieVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/videos/${movieId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch movie videos.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}`;
    
    if (!window.confirm("Are you sure you want to import videos from TMDB?")) {
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.get(tmdbEndpoint);
      const tmdbVideos = response.data.results || [];
  
      if (tmdbVideos.length === 0) {
        alert("No videos found on TMDB for this movie.");
        return;
      }
  
      const mappedVideos = tmdbVideos.map((video) => ({
        movieId,
        userId,
        url: `https://www.youtube.com/embed/${video.key}`,
        name: video.name || "Unknown Name",
        site: video.site || "Unknown Site",
        videoType: video.type || "Unknown Type",
        videoKey: video.key || "",
        official: video.official ? 1 : 0,
      }));
  
      await Promise.all(
        mappedVideos.map(async (videoPayload) => {
          await axios.post("/videos", videoPayload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
        })
      );
  
      alert("Videos imported successfully.");
      await fetchMovieVideos();
    } catch (err) {
      console.error("Error importing videos:", err.response || err.message);
      alert("Failed to import videos from TMDB.");
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
      movieId,
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
      
      const response = editing 
      ? await axios.patch(`/admin/videos/${selectedVideo.id}`, videoPayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : await axios.post("/videos", videoPayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      
      console.log("Update response:", response.data);
      alert(editing ? "Video updated." : "New Video added.");
    
      await fetchMovieVideos();
      resetForm();
    } catch (error) {
      console.error("Error details:", error.response || error.message);
      alert("An error occurred while saving the video.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    resetForm();
    setEditing(false);
};

  const handleEdit = (video) => {
    if (!video) return;
    setSelectedVideo(video);
    setUrl(video.url || "");
    setName(video.name || "");
    setSite(video.site || "");
    setVideoType(video.videoType || "");
    setVideoKey(video.videoKey || "");
    setOfficial(video.official || 0);
    setEditing(true);
  };
  
  const handleDelete = async () => {
    if (selectedVideo) {
      try {
        await axios.delete(`/admin/videos/${selectedVideo.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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
    if (movieId) {
      fetchMovieVideos();
    }
  }, [movieId]);

  return (
    <div className="video-container">
      <h1>Video List</h1>
      <div className="horizontal-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && videos.length === 0 && <p>No videos available.</p>}
        <div className="video-list-container">
          <div className="scrollable-table-container">
            <table className="video-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="video-item">
                    <td>{video.id}</td>
                    <td className="url-cell">
                      <div className="url-content">{`https://www.youtube.com/embed/${video.videoKey}`}</div>
                    </td>
                    <td>
                      <button
                        className="edit-cast-button"
                        onClick={() => handleEdit(video)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-cast-button"
                        onClick={() => handleDelete(video)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="video-form-container">
          <div className="video-form">
            <h2>{selectedVideo ? "Edit Video" : "Add Video"}</h2>
            {url && (
              <div className="video-preview">
                <h3>Video Preview</h3>
                <iframe
                  src={url}
                  title="Video Preview"
                ></iframe>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="url">URL:</label>
                <input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="site">Site:</label>
                <input
                  id="site"
                  type="text"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="videoType">Video Type:</label>
                <input
                  id="videoType"
                  type="text"
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="videoKey">Video Key:</label>
                <input
                  id="videoKey"
                  type="text"
                  value={videoKey}
                  onChange={(e) => setVideoKey(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="official">Official:</label>
                <select
                  id="official"
                  value={official}
                  onChange={(e) => setOfficial(Number(e.target.value))}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <button type="submit" className="save-button" disabled={isSubmitting}>
                {selectedVideo ? "Save" : "Add Video"}
              </button>
              {!editing && (
                <button type="button" className="save-button" onClick={handleImport}>
                  Import from TMDB
                </button>
              )}
              {editing && (
                <button type="button" className="save-button" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Videos;