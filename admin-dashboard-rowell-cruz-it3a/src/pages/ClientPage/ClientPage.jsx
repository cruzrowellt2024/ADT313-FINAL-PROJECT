import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './ClientPage.css';

function ClientPage() {

  return (
    <div className='Main'>
      <div className="container">
        <div className="navigation"><h1>Client</h1>
        </div>
      </div>
    </div>
  );
}

export default ClientPage;
