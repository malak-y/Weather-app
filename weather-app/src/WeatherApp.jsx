import { useState, useEffect } from "react";

const WeatherApp = () => {
  const [city, setCity] = useState("Cairo");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "359f8b5e1e4aef273678d3b28f86e041"; 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(null);
        setLoading(true);
        setWeather(null);
        setForecast([]);

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
          throw new Error(weatherData.message);
        }
        setWeather(weatherData);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
          throw new Error(forecastData.message);
        }

        const dailyForecast = forecastData.list.filter((entry) =>
          entry.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);

      } catch (err) {
        console.error("API Error:", err.message);
        setError(`City not found: ${city}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">🌤 Dynamic Weather App</h1>

      <div className="w-full max-w-md bg-white text-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="text-center mt-6">
            <h2 className="text-2xl font-semibold">{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt="Weather Icon"
              className="w-24 h-24 mx-auto animate-pulse"
            />
            <p className="text-4xl font-bold">{weather.main.temp}°C</p>
            <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
          </div>
        )}
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && !loading && (
        <div className="mt-8 w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day) => (
              <div key={day.dt} className="bg-blue-100 text-center p-4 rounded-lg shadow-md">
                <p className="font-semibold text-gray-700">{new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="Forecast Icon"
                  className="mx-auto"
                />
                <p className="text-lg font-bold">{day.main.temp}°C</p>
                <p className="capitalize text-gray-600">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
