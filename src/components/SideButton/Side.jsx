// src/contexts/GlobalContext.js
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalValue, setGlobalValue] = useState(true);

  return (
    <GlobalContext.Provider value={{ globalValue, setGlobalValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
