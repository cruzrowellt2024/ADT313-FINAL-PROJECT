import { useEffect } from 'react';
import { useMovieContext } from '../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import './View.css';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
    return () => {};
  }, [movieId]);

  return (
    <>
      {movie && (
        <div className='view-container'>
          <div
            className='movie-detail-container'
            style={{
              backgroundImage: `url(${movie.backdropPath && !movie.backdropPath.includes('null') && !movie.backdropPath.includes('undefined') ? movie.backdropPath : (movie.posterPath || 'https://via.placeholder.com/200x300?text=No+Image')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}          
          >
            <div className='movie-poster-container'>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className='movie-poster'
              />
            </div>

            <div className='banner'>
              <h1>{movie.title}</h1>
              <h3>{movie.overview}</h3>
              <p>
                <strong>Popularity:</strong> {movie.popularity}
              </p>
              <p>
                <strong>Vote Average:</strong> {movie.voteAverage}
              </p>
              <p>
                <strong>Release Date:</strong> {movie.release_date}
              </p>
            </div>
          </div>

          {/* Cast Section */}
          {movie?.casts?.length > 0 ? (
            <div>
              <h1>Cast & Crew</h1>
              <div className="horizontal-scroll">
                {movie.casts.map((cast, index) => (
                  <div key={index} className="cast">
                    <img
                      src={cast.url}
                      alt={cast.name}
                      className="cast-image"
                    />
                    <div className="cast-content">
                      <h4>{cast.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h1>Cast & Crew</h1>
              <p>No videos available.</p>
            </div>
          )}

          {/* Videos Section */}
          {movie?.videos?.length > 0 ? (
            <div>
              <h1>Videos</h1>
              <div className="horizontal-scroll">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video">
                    <iframe
                      width="560"
                      height="315"
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="video-content">
                      <h4>{video.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h1>Videos</h1>
              <p>No videos available.</p>
            </div>
          )}


          {/* Photos Section */}
          {movie?.photos?.length > 0 ? (
            <div>
              <h1>Photos</h1>
              <div className="horizontal-scroll">
                {movie.photos.map((photo, index) => (
                  <div key={index} className="photo">
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="photo-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h1>Photos</h1>
              <p>No photos available.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default View;