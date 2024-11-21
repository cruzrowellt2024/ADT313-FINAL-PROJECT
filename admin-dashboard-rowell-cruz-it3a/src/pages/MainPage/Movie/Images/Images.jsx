import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Images = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI', 
          },
        })
        .then((response) => {
          setPhotos(response.data.backdrops); 
        })
        .catch((error) => {
          console.error('Error fetching photos data:', error);
        });
    }
  }, [movieId]);

  return (
    <div>
      <h1>Photos</h1>
      <div className="photos-grid">
        {photos.map((photo) => (
          <img
            key={photo.file_path}
            src={`https://image.tmdb.org/t/p/w500/${photo.file_path}`}
            alt="Movie Photo"
            width={300}
          />
        ))}
      </div>
    </div>
  );
};

export default Images;
