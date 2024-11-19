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
                path: '/main/movies/form/:movieId',
                element: (
                  <h1>Change this for cast & crew CRUD functionality.</h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/cast-and-crews',
                element: (
                  <h1>
                    Change this for cast & crew CRUD functionality component.
                  </h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/photos',
                element: (
                  <h1>Change this for photos CRUD functionality component.</h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/videos',
                element: (
                  <h1>Change this for videos CRUD functionality component.</h1>
                ),
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
