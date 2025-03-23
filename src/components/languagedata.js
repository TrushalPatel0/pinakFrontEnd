import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendurl } from './backend_url';

const useLanguageData = () => {
  const urll = backendurl();
  const [languageData, setLanguageData] = useState([]);


  const fetchLanguageData = async () => {
    try {
      const response = await axios.get(`${urll}language_data`);
      setLanguageData(response.data.data || []);
      console.log(response.data.message);
    } catch (err) {
      console.error(err);
    } finally {
      <></>
    }
  };

  useEffect(() => {
    fetchLanguageData()
  }, []);

  return { languageData };
};

export default useLanguageData;
