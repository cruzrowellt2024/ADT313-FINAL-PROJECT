import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../Movie/MovieCards/MovieCards';
import { useMovieContext } from '../../../context/MovieContext';

const Home = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();
  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    axios
      .get('/movies')
      .then((response) => {
        setMovieList(response.data);
        setMovies(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movies.length) {
        const random = Math.floor(Math.random() * movies.length);
        setFeaturedMovie(movies[random]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  return (
    <main className="home-container">

      {featuredMovie && movies.length > 0 ? (
        <section className="featured-section">
          <div
            className="featured-backdrop"
            aria-label={`Featured Movie: ${featuredMovie.title}`}
            style={{
              backgroundImage: `url(${
                featuredMovie.backdropPath &&
                featuredMovie.backdropPath !== 'https://image.tmdb.org/t/p/original/undefined' &&
                featuredMovie.backdropPath !== 'https://image.tmdb.org/t/p/original/null' &&
                featuredMovie.backdropPath !== featuredMovie.posterPath 
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              })`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => navigate(`/home/view/${featuredMovie.id}`)}
          >
            <span className="featured-movie-title">
              <h1>{featuredMovie.title}</h1>
              <h4>{featuredMovie.overview}</h4>
            </span>
          </div>
        </section>
      ) : (
        <div
          className="featured-list-container-loader"
          aria-busy="true"
          aria-label="Loading featured movie"
        ></div>
      )}

      <section className="list-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCards
              key={movie.id}
              movie={movie}
              onClick={() => {
                navigate(`/home/view/${movie.id}`);
                setMovie(movie);
              }}
            />
          ))
        ) : (
          <p>No movies available</p>
        )}
      </section>
    </main>
  );
};

export default Home;