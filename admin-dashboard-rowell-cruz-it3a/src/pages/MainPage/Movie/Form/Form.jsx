import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../../../../context/UserContext'; 
import './Form.css';

const Form = () => {
  const [showDropdown, setShowDropdown] = useState(true);
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { movieId } = useParams();

  const { accessToken } = useUserContext();

  const handleSearch = useCallback(() => {
    if (selectedMovie) {
      setShowDropdown(true); 
    }
    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Accept: 'application/json',
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setSearchedMovieList(response.data.results);
      })
      .catch((error) => console.error('Error fetching search results:', error));
  }, [query, selectedMovie]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setQuery('');
    setShowDropdown(false);
  };

  const handleSave = () => {
    setErrors({});
    
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
    <div className='main-form-container'>
      {!movieId && (
        <>
          <div className='search-container'>
            <label>
              <span>Search Movie:</span>
              <input
                type='text'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button type='button' onClick={handleSearch}>
              Search
            </button>

            {query && searchedMovieList.length > 0 && showDropdown && (
              <ul className='dropdown-list'>
                {searchedMovieList.map((movie) => (
                  <li
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className='dropdown-item'
                  >
                    {movie.original_title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className='whole-form-container'>
        <div className="form-container">
          <form>
            <div className="movie-layout">
              <div className="poster-container">
                {selectedMovie && (
                  <img
                    className="poster-image"
                    src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                    alt={selectedMovie.original_title}
                  />
                )}
              </div>

              <div className="movie-details">
                <div className="field">
                  Title:
                  <input
                    type="text"
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

                <div className="field">
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

                <div className="field">
                  Popularity:
                  <input
                    type="text"
                    value={selectedMovie ? selectedMovie.popularity : ''}
                    onChange={(e) =>
                      setSelectedMovie({
                        ...selectedMovie,
                        popularity: e.target.value,
                      })
                    }
                  />
                  {errors.popularity && <p className="error">{errors.popularity}</p>}
                </div>

                <div className="field">
                  Release Date:
                  <input
                    type="text"
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

                <div className="field">
                  Vote Average:
                  <input
                    type="text"
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

                <button type="button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        {movieId && selectedMovie && (
        <div className='form-container'>
          <div className='tabs'>
            <button
              className='tab-btn'
              onClick={() =>
                navigate(`/main/movies/form/${movieId}/cast`)
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
                navigate(`/main/movies/form/${movieId}/photos`)
              }
            >
              Photos
            </button>
          </div>
          <Outlet />
        </div>
      )}
      </div>
    </div>
  );
};

export default Form;