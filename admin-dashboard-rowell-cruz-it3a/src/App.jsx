import './App.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './pages/MainPage/ThemeContext';
import LoginPage from './pages/Public/LoginPage/LoginPage';
import RegisterPage from './pages/Public/RegisterPage/RegisterPage';
import MainPage from './pages/MainPage/MainPage';
import Movie from './pages/MainPage/Movie/Movie';
import Lists from './pages/MainPage/Movie/Lists/Lists';
import Form from './pages/MainPage/Movie/Form/Form';
import CastAndCrews from './pages/MainPage/Movie/CastAndCrews/CastAndCrews'; 
import Images from './pages/MainPage/Movie/Images/Images'; 
import Videos from './pages/MainPage/Movie/Videos/Videos';  

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
    path: '/main',
    element: <MainPage />,
    children: [
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
            children: [
              {
                path: '/main/movies/form/:movieId/cast-and-crews',
                element: <CastAndCrews />, 
              },
              {
                path: '/main/movies/form/:movieId/images',
                element: <Images />, 
              },
              {
                path: '/main/movies/form/:movieId/videos',
                element: <Videos />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
