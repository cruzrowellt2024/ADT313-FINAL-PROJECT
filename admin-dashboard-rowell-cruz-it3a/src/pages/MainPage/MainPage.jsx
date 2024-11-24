import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
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
    <div className='Main'>
      <div className="container">
        <div className="navigation">
          <ul>
            <li>
              <a href="/main/movies">Movies</a>
            </li>
            <li className="logout">
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
