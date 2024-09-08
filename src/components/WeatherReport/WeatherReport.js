import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WeatherReport = () => {
  const [weather, setWeather] = useState(null);
  const location = useLocation();
  const { city } = location.state || {};

  const fetchWeatherData = async () => {
    try {
      if (!city || !city.name) {
        toast.error('City information is missing.');
        return;
      }

      const API_KEY = process.env.REACT_APP_API_KEY;
      const url = `${process.env.REACT_APP_CITY_WEATHER}q=${city.name}&appid=${API_KEY}&units=metric`; // Added units=metric for Celsius
      console.log('Fetching weather data from URL:', url);

      const response = await axios.get(url);

      if (response.status === 200) {
        setWeather(response.data);
        toast.success(`Latest weather updates for ${city.name} retrieved successfully.`);
      } else {
        toast.error(`Error: Received status code ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`API Error: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        toast.error('Network Error: Unable to reach the API. Please check your connection.');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  if (!weather) {
    return (
      <div>
        <h1>Weather Report</h1>
        <p>Loading...</p>
      </div>
    );
  }

  const {
    name,
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    wind: { speed, deg, gust },
    clouds: { all: cloudiness },
    sys: { country, sunrise, sunset },
  } = weather;

  return (
    <div>
      <h1>Weather Report for {name}</h1>
      <p><strong>Country:</strong> {country}</p>
      <p><strong>Weather:</strong> {currentWeather.description} ({currentWeather.main})</p>
      <p><strong>Temperature:</strong> {temp}°C</p>
      <p><strong>Feels Like:</strong> {feels_like}°C</p>
      <p><strong>Min Temperature:</strong> {temp_min}°C</p>
      <p><strong>Max Temperature:</strong> {temp_max}°C</p>
      <p><strong>Pressure:</strong> {pressure} hPa</p>
      <p><strong>Humidity:</strong> {humidity}%</p>
      <p><strong>Wind Speed:</strong> {speed} m/s</p>
      <p><strong>Wind Direction:</strong> {deg}°</p>
      <p><strong>Wind Gust:</strong> {gust} m/s</p>
      <p><strong>Cloudiness:</strong> {cloudiness}%</p>
      <p><strong>Sunrise:</strong> {new Date(sunrise * 1000).toLocaleTimeString()}</p>
      <p><strong>Sunset:</strong> {new Date(sunset * 1000).toLocaleTimeString()}</p>

      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={true} />
    </div>
  );
};

export default WeatherReport;
