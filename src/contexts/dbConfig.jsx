import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DBConfigContext = createContext();

export const MyProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/some-data')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <MyContext.Provider value={{ data, loading }}>
      {children}
    </MyContext.Provider>
  );
};