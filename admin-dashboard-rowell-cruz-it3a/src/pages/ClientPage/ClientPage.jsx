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
    <div className="client-page">
      <header className="client-header">
        <div className="client-left-side">
        </div>
        <div className="client-center">
          <h1>The Movie DB</h1>
        </div>
        <div className="client-right-side">
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
