/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import PropTypes from 'prop-types';


const defaultState = { celsium: true, fahrenheit: false };

const TemperatureScale = ({ changeScale }) => {
  const [stateTemp] = useState(defaultState);
  const setScaleTemp = (e) => {
    const scale = e.currentTarget.getAttribute('data-temp');
    changeScale(scale);
    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of Object.entries(stateTemp)) {
      if (key === scale) {
        stateTemp[key] = true;
      } else {
        stateTemp[key] = false;
      }
    }
  };
  return (
    <div className="temperature-scale">
      <div className="ui buttons tempscale">
        <button
          type="button"
          data-temp="celsium"
          className="ui button celsium"
          onClick={setScaleTemp}
          disabled={stateTemp.celsium}
        >
          C
        </button>
        <button
          type="button"
          data-temp="fahrenheit"
          className="ui button fahrenheit"
          onClick={setScaleTemp}
          disabled={stateTemp.fahrenheit}
        >
          F
        </button>
      </div>
    </div>
  );
};

TemperatureScale.propTypes = {
  changeScale: PropTypes.func,
};

TemperatureScale.defaultProps = {
  changeScale: () => {},
};

export default TemperatureScale;
