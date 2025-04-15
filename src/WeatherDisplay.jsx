import React from 'react';

export default function WeatherDisplay({ current, forecast }) {
  const { name, main, weather, wind } = current;

  return (
    <div className="weather-display">
      <h2>📍 Weather in {name}</h2>
      <p>🌡️ Temp: {main.temp} °F</p>
      <p>🌤️ Condition: {weather[0].description}</p>
      <p>💧 Humidity: {main.humidity}%</p>
      <p>🌬️ Wind: {wind.speed} mph</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt={weather[0].description}
      />

      <h3>📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, idx) => (
          <div key={idx} className="forecast-card">
            <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <p>{day.main.temp} °F</p>
            <p>{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
