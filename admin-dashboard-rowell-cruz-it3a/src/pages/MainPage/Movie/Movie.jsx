import { Outlet } from 'react-router-dom';

const Movie = () => {

  return (
    <>
      <div className="movie-header">
        <h1>Movies</h1>
      </div>
      <Outlet />
    </>
  );
};

export default Movie;
