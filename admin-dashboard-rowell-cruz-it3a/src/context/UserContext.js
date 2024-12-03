import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook for using UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [movies, setMovies] = useState([]);

  const addMovie = (movie) => {
    setMovies((prevMovies) => {
      if (!prevMovies.some((m) => m.id === movie.id)) {
        return [...prevMovies, movie];
      }
      return prevMovies;
    });
  };

  const removeMovie = (movieId) => {
    setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movieId));
  };

  // Context value
  const value = {
    role,
    setRole,
    accessToken,
    setAccessToken,
    userInfo,
    setUserInfo,
    movies,
    addMovie,
    removeMovie,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};