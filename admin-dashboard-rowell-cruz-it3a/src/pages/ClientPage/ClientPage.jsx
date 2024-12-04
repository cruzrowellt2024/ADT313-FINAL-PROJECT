import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './ClientPage.css';

const Main = () => {
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
