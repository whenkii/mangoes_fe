import React, { createContext, useState, useEffect } from 'react';
import { GetApiData } from '../components/ApiCalls';

export const dbConfigContext = createContext();

export const DBConfigProvider = ({ children }) => {
  const [configData, setConfigData] = useState(null);
  const [configLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await GetApiData("select * from react_config");

        if (!res || res[0] === "ERROR") {
          alert("Error while getting data from DB");
          setLoading(false);
          return;
        }

        if (res.length === 0) {
          alert("No data found in react_config");
          setLoading(false);
          return;
        }

        setConfigData(res);
      } catch (error) {
        alert("Failed to load config:\n" + error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <dbConfigContext.Provider value={[configData, configLoading]}>
      {children}
    </dbConfigContext.Provider>
  );
};