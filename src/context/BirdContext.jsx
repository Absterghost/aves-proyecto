import React, { createContext, useState, useEffect, useContext } from 'react';
import { familias as familiasData } from '../data/familias';
import { aves as avesData } from '../data/aves';

const BirdContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useBirds = () => useContext(BirdContext);

const BirdProvider = ({ children }) => {
  const [familias, setFamilias] = useState([]);
  const [aves, setAves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // The data from aves.js already contains the processed image paths.
    // We just need to create the 'src' property for compatibility with the components.
    const loadedAves = avesData.map(ave => ({
      ...ave,
      src: ave.imagen // 'ave.imagen' is the imported image module
    }));

    // This logic remains correct: associate the loaded birds with each family.
    const familiasConAves = familiasData.map(familia => ({
      ...familia,
      imagenes: loadedAves.filter(ave => ave.familia === familia.nombre)
    }));

    setAves(loadedAves);
    setFamilias(familiasConAves);
    setLoading(false);
  }, []);

  const value = {
    familias,
    aves,
    loading,
  };

  return (
    <BirdContext.Provider value={value}>
      {children}
    </BirdContext.Provider>
  );
};

export default BirdProvider;
