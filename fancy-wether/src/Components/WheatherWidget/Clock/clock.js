/* eslint-disable linebreak-style */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import 'moment/locale/be';


const Clock = ({ appLang, location }) => {
  const [userDate, setUserDate] = useState({ date: new Date() });

  useEffect(() => {
    const IntervalId = setInterval(() => {
      setUserDate(new Date());
    }, 1000);
    return () => clearInterval(IntervalId);
  }, [userDate]);

  const getTz = () => (location.timezone === null ? 'Europe/London' : location.timezone.name);

  return (
    <p className="wheather-widget__date-time">
      <Moment interal={1000} locale={appLang.lang} format="dddd, MMMM  YYYY  HH:mm:ss" tz={getTz()}>
        {userDate}
      </Moment>
    </p>
  );
};

Clock.propTypes = {
  appLang: PropTypes.shape({
    lang: PropTypes.string.isRequired,
  }),
  location: PropTypes.shape({
    timezone: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
};

Clock.defaultProps = {
  appLang: {
    lang: 'En',
  },
  location: {
    timezone: {
      name: 'Europe/London',
    },
  },
};


export default Clock;
