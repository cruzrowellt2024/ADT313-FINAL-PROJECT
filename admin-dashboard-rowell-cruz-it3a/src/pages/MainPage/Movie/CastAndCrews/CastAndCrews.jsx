import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CastAndCrews = ({ movieId }) => {
  const [cast, setCast] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI', 
          },
        })
        .then((response) => {
          setCast(response.data.cast);
        })
        .catch((error) => {
          console.error('Error fetching cast data:', error);
        });
    }
  }, [movieId]);

  return (
    <div>
      <h1>Cast & Crews</h1>
      <ul>
        {cast.map((actor) => (
          <li key={actor.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
              alt={actor.name}
              width={100}
            />
            <p>{actor.name}</p>
            <p>{actor.character}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastAndCrews;
