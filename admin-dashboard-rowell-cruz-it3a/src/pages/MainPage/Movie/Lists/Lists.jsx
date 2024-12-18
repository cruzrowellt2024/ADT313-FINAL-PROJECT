import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../context/UserContext';
import { useMovieContext } from '../../../../context/MovieContext';
import './Lists.css';

const Lists = () => {
  const { accessToken } = useUserContext();
  const navigate = useNavigate();
  const { movieList, setMovieList} = useMovieContext();

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setMovieList(response.data);
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
          const tempLists = [...movieList];
          const index = movieList.findIndex((movie) => movie.id === id);
          if (index !== undefined || index !== -1) {
            tempLists.splice(index, 1);
            setMovieList(tempLists);
          }
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movieList.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => {
                      navigate('/main/movies/form/' + movie.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-movie-button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;