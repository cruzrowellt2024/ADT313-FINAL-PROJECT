import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [flipped, setFlipped] = useState({});

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm('Are you sure that you want to delete this data?');
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          const tempLists = lists.filter((movie) => movie.id !== id);
          setLists(tempLists);
        });
    }
  };

  const toggleFlip = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button type="button" onClick={() => navigate('/main/movies/form')}>
          Create new
        </button>
      </div>
      <div className="table-container">
        <div className="movie-lists">
          {lists.map((movie) => (
            <div
              className={`movie-box ${flipped[movie.id] ? 'flipped' : ''}`}
              key={movie.id}
              onClick={() => toggleFlip(movie.id)}
            >
              <div className="movie-inner">
                {/* Front side (Poster and Title) */}
                <div className="movie-front">
                  <img
                    className="poster-image"
                    src={movie.posterPath || 'https://via.placeholder.com/200x300'}
                    alt={movie.title}
                  />
                  <div className="movie-title">{movie.title}</div>
                </div>
                {/* Back side (Buttons) */}
                <div className="movie-back">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/main/movies/form/' + movie.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(movie.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lists;
