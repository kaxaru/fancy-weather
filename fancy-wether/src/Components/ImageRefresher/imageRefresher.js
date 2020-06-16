/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';


const ImageRegresher = ({ click }) => (
  <button
    type="button"
    className="ui icon button update-image"
    onClick={() => {
      click();
    }}
  >
    <i className="sync icon spinner" />
  </button>
);

ImageRegresher.propTypes = {
  click: PropTypes.func,
};

ImageRegresher.defaultProps = {
  click: () => {},
};

export default ImageRegresher;
