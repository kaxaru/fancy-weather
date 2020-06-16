/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Skycons from 'react-skycons';
import Moment from 'react-moment';
import { WEATHERAPIKEY, YANDEXAPIKEY } from '../../Data/default';
import 'moment-timezone';
import 'moment/locale/ru';
import 'moment/locale/be';
import getWeatherIcon from './wheatherUtils';

import Clock from './Clock/clock';

import WheatherToday from './wheatherToday/wheatherToday';

import { Vocabulary } from '../../Data/vocabulary';


const userQuery = {
  latitude: 0, longitude: 0, site: null, timezone: null,
};
const weatherUrl = 'https://api.weatherapi.com/v1/';
const translatelink = 'https://translate.yandex.net';

const responseFromServer = async (url, setNotification) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      setNotification(`request limit exceeded, status error: ${response.status}`);
    }
    setNotification(`something was wrong: ${response.status}`);
  }
  const data = await response.json();
  return data;
};


const WheatherWidget = ({
  query,
  tempScale,
  appLang,
  specialCommand,
  setNotification,
}) => {
  const [userQueryLocation, setUserQueryLocation] = useState(userQuery);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [weatherScale, setWeatherScale] = useState(null);
  const [weatherStatusBy, setWeatherStatusBy] = useState('');

  useEffect(() => {
    if (query === null) {
      return undefined;
    }
    const {
      latitude, longitude, site, timezone,
    } = query;
    setUserQueryLocation({
      latitude, longitude, site, timezone,
    });
    return undefined;
  }, [query]);

  useEffect(() => {
    if (tempScale === null) {
      return undefined;
    }
    if (tempScale.tempScale === weatherScale?.tempScale) {
      return undefined;
    }
    setWeatherScale(tempScale);
    return undefined;
  }, [tempScale, weatherScale?.tempScale]);

  useEffect(() => {
    const getWeather = async () => {
      const { latitude, longitude } = userQueryLocation;
      const coordinates = `${latitude},${longitude}`;
      if (coordinates === '0,0') {
        return;
      }
      try {
        const weatherInfoQuery = await responseFromServer(
          `${weatherUrl}forecast.json?key=${WEATHERAPIKEY}&q=${coordinates}&days=10&lang=${appLang.lang}`,
          setNotification,
        );
        setWeatherInfo(weatherInfoQuery);
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    getWeather();
  }, [userQueryLocation, appLang, weatherStatusBy, query, setNotification]);

  useEffect(() => {
    if (appLang.lang === 'Be') {
      const getTranslateWStatus = async () => {
        try {
          if (weatherInfo === null) {
            return;
          }
          const weatherQuery = weatherInfo.current.condition.text.split(' ').join('%20');
          const translateStatus = await responseFromServer(
            `${translatelink}/api/v1.5/tr.json/translate?key=${YANDEXAPIKEY}&text=${weatherQuery}&lang=be`,
            setNotification,
          );
          setWeatherStatusBy(translateStatus.text[0]);
        } catch (error) {
          throw new Error(`invalid request for ${query}`);
        }
      };

      getTranslateWStatus();
    }
  }, [weatherInfo, appLang.lang, query, setNotification]);

  const getTempRound = (temp) => Math.round(temp);

  const translateTemp = (temp) => {
    if (weatherScale === null) {
      return getTempRound(temp);
    }
    if (weatherScale?.tempScale === 'celsium') {
      return getTempRound(temp);
    }
    return getTempRound((temp / 5) * 9 + 32);
  };

  const getRegion = () => {
    if (userQueryLocation.site === null) {
      return undefined;
    }
    if (userQueryLocation.site.city === undefined) {
      if (userQueryLocation.site.county === undefined) {
        return `${userQueryLocation.site.country}, ${userQueryLocation.site.state}`;
      }
      return `${userQueryLocation.site.country}, ${userQueryLocation.site.county}`;
    }

    return `${userQueryLocation.site.country}, ${userQueryLocation.site.city}`;
  };

  const setTempSign = () => {
    if (weatherScale?.tempScale === 'fahrenheit') {
      return '°F';
    }
    return '°C';
  };

  const currentWeatherStatus = () => {
    if (appLang.lang === 'Be') {
      return weatherStatusBy;
    }
    return weatherInfo?.current.condition.text;
  };

  const forecastMessage = () => {
    let message = '';
    if (appLang.lang === 'En') {
      message = `The current temperature for ${getRegion()} is ${translateTemp(weatherInfo?.current.temp_c)} 
      degrees for ${weatherScale?.tempScale === 'fahrenheit' ? 'fahrenheit' : 'celsium'}.`;
      message = `${message} ${currentWeatherStatus()}, temperature feels 
      like is ${translateTemp(weatherInfo?.current.feelslike_c)} degrees 
      for ${weatherScale?.tempScale === 'fahrenheit' ? 'fahrenheit' : 'celsium'}.`;
      message = `${message} speed of wind in limit ${weatherInfo?.current.wind_kph} kilometer in hour.`;
      message = `${message} humidity someabout is ${weatherInfo?.current.humidity}`;
    }
    if (appLang.lang === 'Ru') {
      message = `Текущая температура для региона ${getRegion()} 
      около ${translateTemp(weatherInfo?.current.temp_c)} градусов 
      по ${weatherScale?.tempScale === 'fahrenheit' ? 'фаренгейту' : 'цельсию'}.`;
      message = `${message} ${currentWeatherStatus()}, температура 
      чувствуется как ${translateTemp(weatherInfo?.current.feelslike_c)} 
      градусов по ${weatherScale?.tempScale === 'fahrenheit' ? 'фаренгейту' : 'цельсию'}.`;
      message = `${message} скорость ветра состовляет ${weatherInfo?.current.wind_kph} километров в час.`;
      message = `${message} влажность около ${weatherInfo?.current.humidity}.`;
    }
    if (appLang.lang === 'Be') {
      message = `Тэмпература для рэгіёну ${getRegion()} 
      каля ${translateTemp(weatherInfo?.current.temp_c)} 
      градусаў па ${weatherScale?.tempScale === 'fahrenheit' ? 'фаренгейту' : 'цельсию'}.`;
      message = `${message} ${currentWeatherStatus()}, тэмпература 
      адчуваяцца як ${translateTemp(weatherInfo?.current.feelslike_c)} градусаў 
      па ${weatherScale?.tempScale === 'fahrenheit' ? 'фаренгейту' : 'цельсию'}.`;
      message = `${message} хуткасць ветру складае ${weatherInfo?.current.wind_kph} кіламетраў у гадзіну.`;
      message = `${message} вільготнасць каля ${weatherInfo?.current.humidity}.`;
    }
    return message;
  };

  return (
    <div className="wheather-widget">
      <div className="wheather-widget__location">
        <div className="region">
          <p>{getRegion()}</p>
          {' '}
        </div>
      </div>
      <Clock appLang={appLang} location={userQueryLocation} />
      <div className=" wheather-widget__wheather-today">
        <WheatherToday appLang={appLang} forecastMessage={forecastMessage} specialCommand={specialCommand} />
      </div>
      <p
        className="wheather-widget__temperature-today"
      >
        {weatherInfo === null ? null : translateTemp(weatherInfo?.current.temp_c)}
      </p>
      <p className="wheather-widget__tempScale-today">{setTempSign()}</p>

      <Skycons
        className="wheather-widget__wheather-icon"
        color="black"
        icon={getWeatherIcon(weatherInfo?.current.condition.code, weatherInfo?.current.is_day)}
        autoplay
      />
      <div className="wheather-widget__info">
        <p>{currentWeatherStatus()}</p>
        <p>
          {Vocabulary[appLang.lang].FeelsLike}
          {' '}
          :
          {' '}
          {weatherInfo === null ? null : translateTemp(weatherInfo?.current.feelslike_c)}
          {' '}
          {setTempSign()}
        </p>
        <p>
          {Vocabulary[appLang.lang].Wind}
          :
          {' '}
          {weatherInfo?.current.wind_kph}
          {' '}
          {Vocabulary[appLang.lang].WindMeasure}
        </p>
        <p>
          {Vocabulary[appLang.lang].Humidity}
          :
          {' '}
          {weatherInfo?.current.humidity}
          {' '}
        </p>
      </div>
      <div className="forecast-wrapper">
        <div className="forecast">
          <p className="forecast__day">
            <Moment format="dddd, DD/MM" locale={appLang.lang}>
              {weatherInfo?.forecast.forecastday[0].date}
            </Moment>
          </p>
          <p className="forecast__temp">
            {weatherInfo === null ? null : translateTemp(weatherInfo?.forecast.forecastday[0].day.avgtemp_c)}
          </p>
          <p className="tempScale">{setTempSign()}</p>
          <Skycons
            className="forecast__icon"
            color="black"
            icon={getWeatherIcon(weatherInfo?.forecast.forecastday[0].day.condition.code, weatherInfo?.current.is_day)}
            autoplay
          />
        </div>
        <div className="forecast">
          <p className="forecast__day">
            <Moment format="dddd, DD/MM" locale={appLang.lang}>
              {weatherInfo?.forecast.forecastday[1].date}
            </Moment>
          </p>
          <p className="forecast__temp">
            {weatherInfo === null ? null : translateTemp(weatherInfo?.forecast.forecastday[1].day.avgtemp_c)}
          </p>
          <p className="tempScale">{setTempSign()}</p>
          <Skycons
            className="forecast__icon"
            color="black"
            icon={getWeatherIcon(weatherInfo?.forecast.forecastday[1].day.condition.code, weatherInfo?.current.is_day)}
            autoplay
          />
        </div>
        <div className="forecast">
          <p className="forecast__day">
            <Moment format="dddd, DD/MM" locale={appLang.lang}>
              {weatherInfo?.forecast.forecastday[2].date}
            </Moment>
          </p>
          <p className="forecast__temp">
            {weatherInfo === null ? null : translateTemp(weatherInfo?.forecast.forecastday[2].day.avgtemp_c)}
          </p>
          <p className="tempScale">{setTempSign()}</p>
          <Skycons
            className="forecast__icon"
            color="black"
            icon={getWeatherIcon(weatherInfo?.forecast.forecastday[2].day.condition.code, weatherInfo?.current.is_day)}
            autoplay
          />
        </div>
      </div>

    </div>
  );
};

WheatherWidget.propTypes = {
  query: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    site: PropTypes.object,
    timezone: PropTypes.object,
  }),
  tempScale: PropTypes.shape({
    tempScale: PropTypes.string,
  }),
  appLang: PropTypes.shape({
    lang: PropTypes.string,
  }),
  specialCommand: PropTypes.shape({
    command: PropTypes.string,
  }),
  setNotification: PropTypes.func,
};

WheatherWidget.defaultProps = {
  query: {
    latitude: 0,
    longitude: 0,
    site: {},
    timezone: {},
  },
  tempScale: {
    tempScale: 'celsium',
  },
  appLang: {
    lang: 'En',
  },
  specialCommand: {
    command: '',
  },
  setNotification: () => {},
};

export default WheatherWidget;
