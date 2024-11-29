import './App.css';
import './index.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ButtonProvider } from './context/ButtonContext';
import Login from './pages/Public/LoginPage/Login';
import Register from './pages/Public/RegisterPage/Register';
import Dashboard from './pages/MainPage/Dashboard/Dashboard';
import MainPage from './pages/MainPage/Main';
import Movie from './pages/MainPage/Movie/Movie';
import Lists from './pages/MainPage/Movie/Lists/Lists';
import Form from './pages/MainPage/Movie/Form/Form';
import CastAndCrews from './pages/MainPage/Movie/CastAndCrews/CastAndCrews'; 
import Images from './pages/MainPage/Movie/Images/Images'; 
import Videos from './pages/MainPage/Movie/Videos/Videos';  
import ClientPage from './pages/ClientPage/ClientPage';  
import Home from './pages/ClientPage/Home/Home';  

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <MainPage />,
    children: [
      {
        path: 'movies',
        element: <Movie />,
        children: [
          {
            path: '',
            element: <Lists />,
          },
          {
            path: 'form/:movieId?',
            element: <Form />,
            children: [
              {
                path: 'cast',
                element: <CastAndCrews />,
              },
              {
                path: 'images',
                element: <Images />,
              },
              {
                path: 'videos',
                element: <Videos />,
              },
            ],
          },
        ],
      },
      {
        path: '/main/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/home',
    element: <ClientPage/>,
    children: [
        {
          path: '',
          element: <Home/>
        },
        {
          path: 'movie/:movieId',
          element: <Movie/>
        }
    ]
  }
]);

function App() {
  return (
    <UserProvider>
      <ButtonProvider>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </ButtonProvider>
    </UserProvider>
  );
}

export default App;
