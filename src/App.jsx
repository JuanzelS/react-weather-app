import React, { useState, useEffect } from 'react';
import WeatherDisplay from './WeatherDisplay';
import './App.css';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeFav, setActiveFav] = useState(null);

  useEffect(() => {
    const last = localStorage.getItem('lastSearch');
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favs);
    if (last) {
      setInput(last);
      fetchWeather(last);
    }
  }, []);

  const saveToLocalStorage = (query) => localStorage.setItem('lastSearch', query);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData([]);

    let endpoint;
    if (/^\d{5}$/.test(query)) endpoint = `zip=${query},us`;
    else if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(query)) {
      const [lat, lon] = query.split(',');
      endpoint = `lat=${lat}&lon=${lon}`;
    } else endpoint = `q=${query}`;

    try {
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?${endpoint}&appid=${API_KEY}&units=imperial`);
      const weatherJson = await weatherRes.json();
      if (weatherJson.cod !== 200) throw new Error(weatherJson.message);
      setWeatherData(weatherJson);

      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${endpoint}&appid=${API_KEY}&units=imperial`);
      const forecastJson = await forecastRes.json();
      if (forecastJson.cod !== '200') throw new Error(forecastJson.message);

      const dailyForecasts = forecastJson.list.filter(item => item.dt_txt.includes('12:00:00'));
      setForecastData(dailyForecasts);
      saveToLocalStorage(query);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(input);
  };

  const addFavorite = () => {
    if (!favorites.includes(input)) {
      const updated = [...favorites, input];
      setFavorites(updated);
      localStorage.setItem('favorites', JSON.stringify(updated));
    }
  };

  const selectFavorite = (fav) => {
    setInput(fav);
    setActiveFav(fav);
    fetchWeather(fav);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>🌦️ React Weather App</h1>
        <form onSubmit={handleSubmit} className="weather-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Zip, City, or Lat,Lng"
            required
          />
          <button type="submit">Get Weather</button>
          <button type="button" onClick={addFavorite}>⭐ Save</button>
        </form>

        {favorites.length > 0 && (
          <div className="favorites">
            <h4>⭐ Favorites:</h4>
            {favorites.map((fav, idx) => (
              <button key={idx} className={activeFav === fav ? "active-fav" : ""} onClick={() => selectFavorite(fav)}>
                {fav}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="info">⏳ Loading weather data...</p>}
        {error && <p className="error">⚠️ {error}</p>}
        {weatherData && <WeatherDisplay current={weatherData} forecast={forecastData} />}
      </div>
    </div>
  );
}