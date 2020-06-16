/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react';
import { Lines } from 'react-preloaders';
import ImageRefresher from './ImageRefresher/imageRefresher';
import LangPanel from './LangPanel/langPanel';
import TemperatureScale from './TemperatureScale/temperatureScale';
import SearchWidget from './SearchWidget/searchWidget';
// eslint-disable-next-line import/no-cycle
import WheatherWidget from './WheatherWidget/wheatherWidget';
import MapWidget from './MapWidget/MapWidget';
import UserNotification from './UserNotification/userNotification';


import { IPINFOAPIKEY, OPENCAGEAPIKEY } from '../Data/default';

const ipinfoUrl = 'https://ipinfo.io/';
const picURL = 'https://picsum.photos/';
const opencageUrl = 'https://api.opencagedata.com/geocode/v1/';

const randomSize = () => 1000 - Math.ceil(Math.random() * 100);

const styleComponent = {
  height: '120vh',
  backgroundImage: `url(${picURL}/${randomSize()}/${randomSize()})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
};

const responseFromServer = async (url, setNotification) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      setNotification({ status: true, message: `request limit exceeded, status error: ${response.status}` });
      throw new Error(`request limit exceeded, status error: ${response.status}`);
    }
    setNotification({ status: true, message: `something was wrong: ${response.status}` });
  }
  const data = await response.json();
  return data;
};

const defaultLang = () => localStorage.userLang || 'En';

const App = () => {
  const [background, setBackground] = useState(styleComponent);
  const [userInfo, setUserInfo] = useState(null);
  const [, setLocationInfo] = useState(null);
  const [queryLocation, setQueryLocation] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [tempScale, setTempScale] = useState(null);
  // const [logger, setLoggerInfo] = useState(null);
  const [appLang, setAppLang] = useState({ lang: defaultLang() });
  const [notification, setNotification] = useState({ status: false, message: '' });
  const [isRender, setStateRender] = useState(false);
  const [specialCommand, setSpecialCommand] = useState({ command: '' });

  const changeBG = () => {
    const style = {
      ...styleComponent, backgroundImage: `url(${picURL}/${randomSize()}/${randomSize()})`,
    };
    setBackground(style);
  };

  useEffect(() => {
    const msg = `
        Кнопки для управления голосом.
        1)En: weather, louder, quiter, off, max
        2)Ru: погода, громче, тише, выключить, максимум
        3)Be: надвор'е, гучней, цішэй, выключыць, максимум
    `;


    setNotification({ status: true, message: msg, header: 'User info' });
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      try {
        // eslint-disable-next-line consistent-return
        const getUserLocation = async () => {
          const userGeolocationInfo = () => new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject,
              { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 });
          });
          try {
            const { coords } = await userGeolocationInfo();
            return `${coords.latitude},${coords.longitude}`;
          } catch (error) {
            throw new Error(error);
          }
        };

        const geolocation = getUserLocation();

        geolocation.then((glc) => {
          const setUserCoordinates = (locationInfoRes) => {
            const location = {
              latitude: locationInfoRes.geometry.lat,
              longitude: locationInfoRes.geometry.lng,
              site: locationInfoRes.components,
              timezone: locationInfoRes.annotations.timezone,
            };
            localStorage.setItem('location', JSON.stringify(location));
            setQueryLocation(location);
          };


          if (glc === '') {
            responseFromServer(`${ipinfoUrl}json?token=${IPINFOAPIKEY}`, setNotification).then((userDataInfo) => {
              setUserInfo(userDataInfo);
              setUserCoordinates(userDataInfo);
            });
          }

          const userCoordinates = glc === '' ? userInfo.loc : glc;
          responseFromServer(
            // eslint-disable-next-line max-len
            `${opencageUrl}json?q=${userCoordinates}&key=${OPENCAGEAPIKEY}&language=${appLang.lang.toLocaleLowerCase()}&pretty=1`,
            setNotification,
          ).then((locInfo) => {
            setLocationInfo(locInfo);
            const locationInfoRes = locInfo.results[0];
            setUserCoordinates(locationInfoRes);
          });
        });
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    if (userQuery.trim() === '') {
      getInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLang]);

  useEffect(() => {
    const getInfoUserQuery = async () => {
      try {
        const locInfo = await responseFromServer(
          `${opencageUrl}json?q=${userQuery}&key=${OPENCAGEAPIKEY}&language=${appLang.lang.toLocaleLowerCase()}&pretty=1`,
          setNotification,
        );
        const locationInfoRes = locInfo.results[0];
        if (locationInfoRes === undefined) {
          setNotification({ status: true, message: `Invalid request for ${userQuery}. Current adress not exist` });
        }
        setLocationInfo(locInfo);
        const location = {
          latitude: locationInfoRes.geometry.lat,
          longitude: locationInfoRes.geometry.lng,
          site: locationInfoRes.components,
          timezone: locationInfoRes.annotations.timezone,
        };
        localStorage.setItem('userQuery', JSON.stringify(location));
        setQueryLocation(location);
      } catch (error) {
        throw new Error('invalid request');
      }
    };
    if (userQuery.trim() !== '') {
      getInfoUserQuery();
    }
  }, [userQuery, appLang]);

  useEffect(() => {
    const IntervalId = setInterval(() => {
      if (queryLocation !== null) {
        setStateRender(true);
      } else {
        setStateRender(false);
      }
    }, 1000);
    return () => clearInterval(IntervalId);
  }, [queryLocation]);


  const setScale = (scale) => {
    const userTemp = {
      tempScale: scale,
    };
    setTempScale(userTemp);
  };

  const curLang = (lang) => {
    setAppLang({ lang });
  };

  const userQueryInfo = (query) => {
    setUserQuery(query);
  };

  const isModalClose = (status) => {
    const isChangeNotification = {
      ...notification,
      status: !status,
    };
    setNotification(isChangeNotification);
  };

  return (
    <>
      <div className="image-container" style={background}>
        <div className="image-container__overlay">
          <div className="upper-widget">
            <div className="left-panel">
              <ImageRefresher click={changeBG} />
              <LangPanel userLang={curLang} />
              <TemperatureScale changeScale={setScale} />
            </div>
            <div className="right-panel">
              <SearchWidget
                appLang={appLang}
                userQuery={userQueryInfo}
                setSpecialCommand={setSpecialCommand}
                changeBG={changeBG}
              />
            </div>
          </div>
          <div className="main-wrapper">
            { isRender ? (
              <WheatherWidget
                query={queryLocation}
                tempScale={tempScale}
                appLang={appLang}
                specialCommand={specialCommand}
                setNotification={setNotification}
              />
            ) : null}
            { isRender ? <MapWidget query={queryLocation} appLang={appLang} /> : null}
          </div>
        </div>
        <UserNotification userNotification={notification} isModalClose={isModalClose} />
      </div>
      <Lines animation="slide-right" customLoading={isRender} />
    </>
  );
};

export default App;
