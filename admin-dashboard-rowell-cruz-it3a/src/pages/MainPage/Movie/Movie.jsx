import { Outlet, useNavigate } from 'react-router-dom';
import { useButtonContext } from '../../../context/ButtonContext';
import { useUserContext } from '../../../context/UserContext';
import './Movie.css';

const Movie = () => {
  const navigate = useNavigate();
  const { isCreateMode, setIsCreateMode, title, setTitle } = useButtonContext();
  const { role, accessToken } = useUserContext();

  const handleButtonClick = () => {
    if (isCreateMode) {
      setTitle('Create Movie');
      navigate('/main/movies/form');
    } else {
      setTitle('Movies');
      navigate('/main/movies');
    }
    setIsCreateMode(!isCreateMode);
  };

  return (
    <>
      <div className="movie-header">
        <h1>{title}</h1>
        <div className="create-container">
          <button type="button" className="create-button" onClick={handleButtonClick}>
            {isCreateMode ? 'Create New' : 'Back'}
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Movie;