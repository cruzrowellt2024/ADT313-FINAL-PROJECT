import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from './../ThemeContext'; // Ensure this import is correct

const Movie = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="movie-header">
        <h1>Movies</h1>
        <button 
          onClick={toggleTheme} 
          className="toggle-theme">
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default Movie;
