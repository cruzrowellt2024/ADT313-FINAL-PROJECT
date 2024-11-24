import './App.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { UserProvider } from './context/UserContext';
import LoginPage from './pages/Public/LoginPage/LoginPage';
import RegisterPage from './pages/Public/RegisterPage/RegisterPage';
import MainPage from './pages/MainPage/MainPage';
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
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin/register',
    element: <RegisterPage />,
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
                path: 'cast-and-crews',
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
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
