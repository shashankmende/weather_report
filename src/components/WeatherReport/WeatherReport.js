import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import coordinates from '../../assets/coordinates.png'
import halfMoon from '../../assets/half_moon.png'
import { IoLocationOutline } from "react-icons/io5";

import './WeatherReport.css'
import Cards from '../../Cards/Cards';

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
    coord:{lon,lat},
    // weather:{main,description}
  } = weather;

  return (
    <div className='weather_bg_container'>
      
      <h1 className='weather_heading'>Weather Report for {name}</h1>
      <div className='coordinates_card'>
        <img src={coordinates} alt="" className='coordinates_img' />
        <div>
          <p>Longitude: <strong style={{color:'blue'}}>{lon}</strong></p>
          <p>Latitude: <strong style={{color:'blue'}}  >{lat}</strong></p>
        </div>
      </div>

      <div className='details_container'>
        <div className='left_container'>
          <h1  className='weather_heading'>Current Weather</h1>
          <p style={{color:"black"}}><IoLocationOutline/> {name}</p>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <img src={halfMoon} alt="halfmoon" />
            <h1>{temp}<sup style={{fontSize:'12px'}}>o</sup>C</h1>
          </div>
          <div>
            <h1>Haze</h1>
            <p>feels like {feels_like}<sup style={{fontSize:'12px'}}>o</sup></p>
          </div>
          <p>The skies will be mostly cloudy. The low will be {temp_min}°.</p>
          <div className='cards_home_conatiner'>
            <Cards item="Pressue(mb)" value={pressure}/>
            <Cards item="Wind(km/h)" value={speed}/>
            <Cards item="Humidity(%)" value={humidity}/>
            <Cards item="Humidity(%)" value={humidity}/>

          </div>
          
        </div>

      </div>
      

      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={true} />
    </div>
  );
};

export default WeatherReport;
