import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

const Main = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, [accessToken]);

  return (
    <div className="main-page">
      <header className="header">
        <div className="left-side">
          <button className="dropdown-btn" onClick={toggleDropdown}>
            &#9776; Menu
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="/main/dashboard">Dashboard</a>
              <a href="/main/movies">Movies</a>
            </div>
          )}
        </div>
        <div className="center">
          <h1>The Movie DB</h1>
        </div>
        <div className="right-side">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="outlet">
          <Outlet />
        </div>
    </div>
  );
};

export default Main;
