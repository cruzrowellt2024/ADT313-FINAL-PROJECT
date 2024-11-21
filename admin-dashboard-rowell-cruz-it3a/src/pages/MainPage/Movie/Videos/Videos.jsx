import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Videos = ({ movieId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',  
          },
        })
        .then((response) => {
          setVideos(response.data.results);  
        })
        .catch((error) => {
          console.error('Error fetching videos data:', error);
        });
    }
  }, [movieId]);

  return (
    <div>
      <h1>Videos</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <h3>{video.name}</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Videos;
