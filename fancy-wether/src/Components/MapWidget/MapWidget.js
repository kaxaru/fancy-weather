/* eslint-disable linebreak-style */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import mapbox from 'mapbox-gl/dist/mapbox-gl';
import { MAPAPIKEY } from '../../Data/default';

import './map.css';

import { Vocabulary } from '../../Data/vocabulary';

const defaultMapConfig = { latitude: 0, longitude: 0, zoom: 10 };

const MapWidget = ({ query, appLang }) => {
  const [mapData, setMapData] = useState(defaultMapConfig);
  const [isMapBuild, setMapBuild] = useState(false);
  const [userMap, setUserMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const mapEl = useRef(null);

  useEffect(() => {
    setMapData({
      ...defaultMapConfig,
      latitude: query?.latitude || 0,
      longitude: query?.longitude || 0,
    });

    if (isMapBuild) {
      userMap.flyTo({
        center: [query.longitude, query.latitude],
        zoom: 10,
        bearing: 0,
        speed: 1,
        curve: 1,
        easing: (t) => t,
        essential: true,
      });
      const marker = new mapbox.Marker()
        .setLngLat([query.longitude, query.latitude])
        .addTo(userMap);
      setUserMarker(marker);
    }
  }, [query, userMap, isMapBuild]);

  useEffect(() => () => {
    if (userMarker !== null) {
      userMarker.remove();
    }
  }, [query, userMarker]);

  useEffect(() => {
    if (isMapBuild) {
      userMap.on('move', () => {
        setMapData({
          latitude: userMap.getCenter().lat.toFixed(4),
          longitude: userMap.getCenter().lng.toFixed(4),
          zoom: userMap.getZoom().toFixed(2),
        });
      });
    }
  }, [userMap, isMapBuild]);

  useEffect(() => {
    if (mapData.latitude === 0 && mapData.longitude === 0) {
      return undefined;
    }
    if (!isMapBuild) {
      mapbox.accessToken = MAPAPIKEY;
      const map = new mapbox.Map({
        container: mapEl.current,
        marker: {
          color: 'orange',
        },
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [mapData.longitude, mapData.latitude],
        zoom: mapData.zoom,
      });
      const marker = new mapbox.Marker()
        .setLngLat([mapData.longitude, mapData.latitude])
        .addTo(map);
      setMapBuild(true);
      setUserMap(map);
      setUserMarker(marker);
    }
    return undefined;
  }, [mapData.longitude, mapData.latitude, mapData.zoom, isMapBuild]);

  const toDMS = (coordinate) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return `${degrees}° ${minutes}" ${seconds}'`;
  };

  const convertDMS = (coordinate, latitude = true) => {
    if (coordinate === 0) {
      return 0;
    }
    const value = toDMS(coordinate);
    if (latitude) {
      return coordinate > 0 ? `${value} N` : `${value} S`;
    }

    return coordinate > 0 ? `${value} E` : `${value} W`;
  };


  return (
    <div className="map-widget">
      <div className="map-wrapper">
        <div ref={mapEl} className="map" />
      </div>
      <div className="coordinates-widget">
        <p>
          {Vocabulary[appLang.lang].Latitude}
          :
          {' '}
          {convertDMS(mapData.latitude)}
        </p>
        <p>
          {Vocabulary[appLang.lang].Longitude}
          :
          {' '}
          {convertDMS(mapData.longitude, false)}
        </p>
        <p>
          {Vocabulary[appLang.lang].Zoom}
          :
          {' '}
          {mapData.zoom}
        </p>
      </div>
    </div>
  );
};

MapWidget.propTypes = {
  query: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    site: PropTypes.object,
    timezone: PropTypes.object,
  }),
  appLang: PropTypes.shape({
    lang: PropTypes.string,
  }),
};

MapWidget.defaultProps = {
  query: {
    latitude: 0,
    longitude: 0,
    site: {},
    timezone: {},
  },
  appLang: {
    lang: 'En',
  },
};


export default MapWidget;
