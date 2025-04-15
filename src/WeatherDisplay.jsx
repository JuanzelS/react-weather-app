import React from 'react';

// Mapping OpenWeatherMap icons to Weather Icons classes
const iconMap = {
  '01d': 'wi-day-sunny',
  '01n': 'wi-night-clear',
  '02d': 'wi-day-cloudy',
  '02n': 'wi-night-alt-cloudy',
  '03d': 'wi-cloud',
  '03n': 'wi-cloud',
  '04d': 'wi-cloudy',
  '04n': 'wi-cloudy',
  '09d': 'wi-showers',
  '09n': 'wi-showers',
  '10d': 'wi-day-rain',
  '10n': 'wi-night-alt-rain',
  '11d': 'wi-thunderstorm',
  '11n': 'wi-thunderstorm',
  '13d': 'wi-snow',
  '13n': 'wi-snow',
  '50d': 'wi-fog',
  '50n': 'wi-fog'
};

export default function WeatherDisplay({ current, forecast }) {
  const { name, main, weather, wind } = current;
  const currentIcon = iconMap[weather[0].icon] || 'wi-na';

  return (
    <div className="weather-display">
      <h2>📍 Weather in {name}</h2>
      <i className={`wi ${currentIcon} weather-icon`}></i>
      <p>🌡️ Temp: {main.temp} °F</p>
      <p>🌤️ Condition: {weather[0].description}</p>
      <p>💧 Humidity: {main.humidity}%</p>
      <p>🌬️ Wind: {wind.speed} mph</p>

      <h3>📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, idx) => {
          const icon = iconMap[day.weather[0].icon] || 'wi-na';
          return (
            <div key={idx} className="forecast-card">
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <i className={`wi ${icon} forecast-icon`}></i>
              <p>{day.main.temp} °F</p>
              <p>{day.weather[0].main}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
