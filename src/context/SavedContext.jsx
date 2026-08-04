import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('savedLodges');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedLodges', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id) => {
    setSavedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(savedId => savedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isSaved = (id) => savedIds.includes(id);

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
