import React, { createContext, useState, useEffect, useCallback } from 'react';

export const EmissionsUpdate = createContext({
  emissions: [],
  refreshEmissions: () => {},
});

export const EmissionsProvider = ({ children }) => {
  const [emissions, setEmissions] = useState([]);

  const refreshEmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/emissions');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setEmissions(data);
    } catch (err) {
      console.error('Failed to load emissions:', err);
      setEmissions([]);
    }
  }, []);

  // load
  useEffect(() => {
    refreshEmissions();
  }, [refreshEmissions]);

  return (
    <EmissionsUpdate.Provider value={{ emissions, refreshEmissions }}>
      {children}
    </EmissionsUpdate.Provider>
  );
};
