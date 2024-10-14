import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AppContext = createContext();

const API_KEY = "b0f97402c0b9944c2ab0d4cee03d0790";
const DEFAULT_LATITUDE = -33.93778;
const DEFAULT_LONGITUDE =18.47083 ;

async function fetchData(url, setter) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setter(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const AppProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [query, setQuery] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const fetchWeatherData = useCallback(() => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    fetchData(currentWeatherUrl, setCurrentWeatherData);
    fetchData(forecastUrl, setForecastData);
  }, [latitude, longitude]);

  const fetchGeoData = useCallback(() => {
    if (query) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
      fetchData(geoUrl, setSearchResults);
    }
  }, [query]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchGeoData();
  }, [fetchGeoData]);

  const value = {
    setLatitude,
    setLongitude,
    currentWeatherData,
    forecastData,
    setQuery,
    searchResults,
    setSearchResults,
    query,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  return useContext(AppContext);
}

export default AppProvider;
