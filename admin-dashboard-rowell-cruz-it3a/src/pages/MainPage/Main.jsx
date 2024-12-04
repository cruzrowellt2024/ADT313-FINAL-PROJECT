import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { useUserContext } from '../../context/UserContext';

const Main = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { accessToken, setAccessToken, role, userInfo } = useUserContext();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userInfo');
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