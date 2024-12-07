import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken);
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

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

  const value = {
    role,
    setRole,
    accessToken,
    setAccessToken,
    userInfo,
    setUserInfo,
    userId: userInfo ? userInfo.userId : null,
    movies,
    addMovie,
    removeMovie,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};