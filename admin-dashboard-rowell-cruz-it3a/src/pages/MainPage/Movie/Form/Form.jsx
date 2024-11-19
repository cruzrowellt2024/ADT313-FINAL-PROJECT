import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId } = useParams();

  // Search for movies (create mode)
  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');

    // Reset errors before validation
    setErrors({});

    // Validate fields
    const validationErrors = {};
    if (!selectedMovie || !selectedMovie.original_title || selectedMovie.original_title.length < 3) {
      validationErrors.title = 'Title must be at least 3 characters long.';
    }
    if (!selectedMovie || !selectedMovie.overview || selectedMovie.overview.length < 10) {
      validationErrors.overview = 'Overview must be at least 10 characters long.';
    }
    if (!selectedMovie || !/^\d{4}-\d{2}-\d{2}$/.test(selectedMovie.release_date)) {
      validationErrors.releaseDate = 'Release date must be in YYYY-MM-DD format.';
    }
    if (!selectedMovie || selectedMovie.vote_average < 0 || selectedMovie.vote_average > 10) {
      validationErrors.voteAverage = 'Vote average must be between 0 and 10.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If no errors, proceed with saving the movie
    const data = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
    };

    // Check if it's an update or new movie
    const request = axios({
      method: movieId ? 'PATCH' : 'POST',
      url: movieId ? `/movies/${movieId}` : '/movies',
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((saveResponse) => {
        setMovie(saveResponse.data);
        alert(movieId ? 'Movie updated successfully' : 'Movie added successfully');
        navigate('/main/movies');
      })
      .catch((error) => console.log(error));
  };

  // Fetch movie details if movieId exists (edit mode)
  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
      });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:{' '}
            <input
              type='text'
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p onClick={() => handleSelectMovie(movie)} key={movie.id}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      <div className='form-container'>
        <form>
          <div className='movie-layout'>
            {/* Left side: Poster Image */}
            <div className='poster-container'>
              {selectedMovie && (
                <img
                  className='poster-image'
                  src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                  alt={selectedMovie.original_title}
                />
              )}
            </div>

            {/* Right side: Movie Details */}
            <div className='movie-details'>
              <div className='field'>
                Title:
                <input
                  type='text'
                  value={selectedMovie ? selectedMovie.original_title : ''}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      original_title: e.target.value,
                    })
                  }
                />
                {errors.title && <p className="error">{errors.title}</p>}
              </div>

              <div className='field'>
                Overview:
                <textarea
                  rows={10}
                  value={selectedMovie ? selectedMovie.overview : ''}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      overview: e.target.value,
                    })
                  }
                />
                {errors.overview && <p className="error">{errors.overview}</p>}
              </div>

              <div className='field'>
                Release Date:
                <input
                  type='text'
                  value={selectedMovie ? selectedMovie.release_date : ''}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      release_date: e.target.value,
                    })
                  }
                />
                {errors.releaseDate && <p className="error">{errors.releaseDate}</p>}
              </div>

              <div className='field'>
                Vote Average:
                <input
                  type='text'
                  value={selectedMovie ? selectedMovie.vote_average : ''}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      vote_average: e.target.value,
                    })
                  }
                />
                {errors.voteAverage && <p className="error">{errors.voteAverage}</p>}
              </div>

              <button type='button' onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className='tabs'>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/images`);
                }}
              >
                Images
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Form;
