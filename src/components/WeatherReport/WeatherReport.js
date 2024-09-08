import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoLocationOutline } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Switch from 'react-switch';
import { DNA } from "react-loader-spinner";

import './WeatherReport.css';
import Cards from '../Cards/Cards';


const WeatherReport = () => {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // Metric for Celsius, imperial for Fahrenheit
  const [tempUnit, setTempUnit] = useState('C');
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const { city } = location.state || {};

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true); // Start loading
      try {
        if (!city || !city.name) {
          toast.error('City information is missing.');
          setIsLoading(false);
          return;
        }
        const API_KEY = process.env.REACT_APP_API_KEY;
        const url = `${process.env.REACT_APP_CITY_WEATHER}q=${city.name}&appid=${API_KEY}&units=${unit}`;
        console.log('Fetching weather data from URL:', url);

        const response = await axios.get(url);

        if (response.status === 200) {
          setWeather(response.data);
          toast.success(`Latest weather updates for ${city.name} retrieved successfully.`);
        } else {
          toast.error(`Error: Received status code ${response.status}`);
        }
        setIsLoading(false); // Stop loading when done
      } catch (error) {
        setIsLoading(false); // Stop loading on error
        if (error.response) {
          toast.error(`API Error: ${error.response.data.message || 'Something went wrong'}`);
        } else if (error.request) {
          toast.error('Network Error: Unable to reach the API. Please check your connection.');
        } else {
          toast.error(`Error: ${error.message}`);
        }
      }
    };

    fetchWeatherData();
  }, [city, unit]);

  const toggleUnit = () => {
    if (unit === 'metric') {
      setUnit('imperial');
      setTempUnit('F');
    } else {
      setUnit('metric');
      setTempUnit('C');
    }
  };

  // Only render the content if weather data is available
  return isLoading ? (
    <div className="loadingContainer">
      <h1>Weather Report</h1>
      <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" />
    </div>
  ) : weather ? (
    <div className="weather_bg_container">
      <h1 className="weather_heading">Weather Report for {weather?.name}</h1>

      <div className="coordinates_card">
        <p>Longitude: <strong style={{ color: 'blue' }}>{weather?.coord?.lon}</strong></p>
        <p>Latitude: <strong style={{ color: 'blue' }}>{weather?.coord?.lat}</strong></p>
      </div>

      <div className="details_container">
        <div className="left_container">
          <h1 className="weather_heading">Current Weather</h1>
          <p style={{ color: "black" }}><IoLocationOutline /> {weather?.name}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1>{weather?.main?.temp}<sup style={{ fontSize: '12px' }}>°{tempUnit}</sup></h1>
          </div>
          <div>
            <h1>{weather?.weather[0]?.main}</h1>
            <p>Feels like {weather?.main?.feels_like}<sup style={{ fontSize: '12px' }}>°{tempUnit}</sup></p>
          </div>
          <p>The skies will be mostly cloudy. The low will be {weather?.main?.temp_min}°.</p>

          <div className="cards_home_conatiner">
            <Cards item="Pressure(mb)" value={weather?.main?.pressure} />
            <Cards item="Wind(km/h)" value={weather?.wind?.speed} />
            <Cards item="Humidity(%)" value={weather?.main?.humidity} />
          </div>

          {/* Temperature Unit Switch */}
          <div className="unit-toggle">
            <span>°C</span>
            <Switch onChange={toggleUnit} checked={unit === 'imperial'} />
            <span>°F</span>
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <MapContainer center={[weather?.coord?.lat, weather?.coord?.lon]} zoom={10} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[weather?.coord?.lat, weather?.coord?.lon]}>
              <Popup>{weather?.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={true} />
    </div>
  ) : (
    <div className='loadingContainer'><h1>No weather data available.</h1></div>
  );
};

export default WeatherReport;



