import { createContext, useContext, useState } from 'react';

const ButtonContext = createContext();

export const ButtonProvider = ({ children }) => {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [title, setTitle] = useState('Movies'); 

  return (
    <ButtonContext.Provider value={{ isCreateMode, setIsCreateMode, title, setTitle }}>
      {children}
    </ButtonContext.Provider>
  );
};

export const useButtonContext = () => useContext(ButtonContext);