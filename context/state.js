import { createContext, useContext, useState } from 'react';
import featured from './../featured.json'

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [collection, setCollection] = useState(featured[0])

  return (
    <AppContext.Provider value={{collection, setCollection}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}