import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // If you're using react-router for navigation
import './CastAndCrews.css';

function CastAndCrews({ movieId }) {
  const navigate = useNavigate();
  const [actorName, setActorName] = useState('');
  const [actorImage, setActorImage] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [dateUpdated, setDateUpdated] = useState('');
  const [errors, setErrors] = useState({});
  const [movieDetails, setMovieDetails] = useState(null);

  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTczMjllNjdmOTA0Mzk1Yjc5NTkyYTNjMjQ1MzE0YiIsIm5iZiI6MTczMjI4ODc1NC4yMDgwMjY2LCJzdWIiOiI2NzJkZWUwYzJkNzY4MTMxZjlhNjRiZTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.21wUtF12GvATOz41gcVrwZKLEWpSrayQqdtCMrcj4dI'; // Replace this with the actual token

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/casts/${movieId}`)
        .then((response) => {
          const { actorName, actorImage, characterName, dateCreated, dateUpdated } = response.data;
          setActorName(actorName);
          setActorImage(actorImage);
          setCharacterName(characterName);
          setDateCreated(dateCreated);
          setDateUpdated(dateUpdated);
        })
        .catch((error) => console.error('Error fetching movie details:', error));
    }
  }, [movieId]);

  const handleSave = () => {
    const validationErrors = {};

    if (!actorName) {
      validationErrors.actorName = 'Actor name is required.';
    }
    if (!actorImage) {
      validationErrors.actorImage = 'Actor image URL is required.';
    }
    if (!characterName) {
      validationErrors.characterName = 'Character name is required.';
    }
    if (!dateCreated) {
      validationErrors.dateCreated = 'Date created is required.';
    }
    if (!dateUpdated) {
      validationErrors.dateUpdated = 'Date updated is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const castData = {
      actorName,
      actorImage,
      characterName,
      dateCreated,
      dateUpdated,
    };

    const request = axios({
      method: 'PATCH',
      url:  '/casts', 
      data: castData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        alert(movieId ? 'Cast & Crew details updated successfully' : 'Cast & Crew details added successfully');
        navigate('/main/movies');  
      })
      .catch((error) => console.log('Error saving Cast & Crew details:', error));
  };

  return (
    <div className="form-container">
      <h1>Cast & Crews</h1>

      {/* Display Movie Title if available */}
      {movieDetails && <h2>{movieDetails.title}</h2>}

      <form>
        <div className="field">
          <label>Actor Name:</label>
          <input
            type="text"
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
            placeholder="Enter actor's name"
          />
          {errors.actorName && <p className="error">{errors.actorName}</p>}
        </div>

        <div className="field">
          <label>Actor Image URL:</label>
          <input
            type="text"
            value={actorImage}
            onChange={(e) => setActorImage(e.target.value)}
            placeholder="Enter actor's image URL"
          />
          {errors.actorImage && <p className="error">{errors.actorImage}</p>}
        </div>

        <div className="field">
          <label>Character Name:</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character's name"
          />
          {errors.characterName && <p className="error">{errors.characterName}</p>}
        </div>

        <div className="field">
          <label>Date Created:</label>
          <input
            type="date"
            value={dateCreated}
            onChange={(e) => setDateCreated(e.target.value)}
          />
          {errors.dateCreated && <p className="error">{errors.dateCreated}</p>}
        </div>

        <div className="field">
          <label>Date Updated:</label>
          <input
            type="date"
            value={dateUpdated}
            onChange={(e) => setDateUpdated(e.target.value)}
          />
          {errors.dateUpdated && <p className="error">{errors.dateUpdated}</p>}
        </div>

        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
}

export default CastAndCrews;
