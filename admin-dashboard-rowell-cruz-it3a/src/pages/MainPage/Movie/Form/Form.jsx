import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId } = useParams();

  // Search for movies (create mode)
  const handleSearch = useCallback(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI', 
          },
        }
      )
      .then((response) => {
        setSearchedMovieList(response.data.results);
      })
      .catch((error) => console.error('Error fetching search results:', error));
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

    if (!selectedMovie?.original_title || selectedMovie.original_title.length < 1) {
      validationErrors.title = 'Title must be at least 1 character long.';
    }
    if (!selectedMovie?.overview || selectedMovie.overview.length < 10) {
      validationErrors.overview = 'Overview must be at least 10 characters long.';
    }
    if (!selectedMovie?.release_date || !/^\d{4}-\d{2}-\d{2}$/.test(selectedMovie.release_date)) {
      validationErrors.releaseDate = 'Release date must be in YYYY-MM-DD format.';
    }
    if (selectedMovie?.vote_average < 0 || selectedMovie?.vote_average > 10) {
      validationErrors.voteAverage = 'Vote average must be between 0 and 10.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare the data for submission
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
    
    const request = axios({
      method: movieId ? 'PATCH' : 'POST',
      url: movieId ? `/movies/${movieId}` : '/movies',
      data: data,  
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        alert(movieId ? 'Movie and reviews updated successfully' : 'Movie and reviews added successfully');
        navigate('/main/movies');
      })
      .catch((error) => console.log('Error saving movie and reviews:', error));
    
  };

  // Fetch movie details if movieId exists (edit mode)
  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const fetchedMovie = response.data;
          const tempData = {
            id: fetchedMovie.tmdbId,
            original_title: fetchedMovie.title,
            overview: fetchedMovie.overview,
            popularity: fetchedMovie.popularity,
            poster_path: fetchedMovie.posterPath,
            release_date: fetchedMovie.releaseDate,
            vote_average: fetchedMovie.voteAverage,
          };
          setSelectedMovie(tempData);
        })
        .catch((error) => console.error('Error fetching movie details:', error));
    }
  }, [movieId]);

  

  return (
    <>
      <h1>{movieId ? 'Edit Movie' : 'Create Movie'}</h1>

      {/* Movie Search Section (for Create Mode) */}
      {!movieId && (
        <>
          <div className='search-container'>
            <label>
              Search Movie:
              <input
                type='text'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Form for Movie Details */}
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
                {errors.title && <p className='error'>{errors.title}</p>}
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
                {errors.overview && <p className='error'>{errors.overview}</p>}
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
                {errors.releaseDate && <p className='error'>{errors.releaseDate}</p>}
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
                {errors.voteAverage && <p className='error'>{errors.voteAverage}</p>}
              </div>

              <button type='button' onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {movieId && selectedMovie && (
        <div>
          <hr />
          <div className='tabs'>
            <button
              className='tab-btn'
              onClick={() =>
                navigate(`/main/movies/form/${movieId}/cast-and-crews`)
              }
            >
              Cast & Crews
            </button>
            <button
              className='tab-btn'
              onClick={() =>
                navigate(`/main/movies/form/${movieId}/videos`)
              }
            >
              Videos
            </button>
            <button
              className='tab-btn'
              onClick={() =>
                navigate(`/main/movies/form/${movieId}/images`)
              }
            >
              Photos
            </button>
          </div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Form;
