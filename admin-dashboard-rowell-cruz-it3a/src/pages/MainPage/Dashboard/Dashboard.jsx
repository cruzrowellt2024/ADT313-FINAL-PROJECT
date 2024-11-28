import { Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {

  return (
    <>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
