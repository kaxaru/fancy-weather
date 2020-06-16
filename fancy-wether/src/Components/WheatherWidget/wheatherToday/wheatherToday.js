/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Slider } from 'react-semantic-ui-range';
import { Grid } from 'semantic-ui-react';
import Synth from '../../../utils/synth';

import { SpecialPhrase } from '../../../Data/vocabulary';

const speechSynth = new Synth();
const langs = [{ lang: 'en-GB', name: 'Google UK English Male' }, { lang: 'ru-RU', name: 'Google русский' }];
speechSynth.populateVoiceList(langs);

const WheatherToday = ({ appLang, forecastMessage, specialCommand }) => {
  const [value, setValue] = useState(5);
  const [command, setCommand] = useState({ command: '' });

  useEffect(() => {
    speechSynth.setVoice(appLang.lang);
  }, [appLang]);

  useEffect(() => {
    setCommand(specialCommand);
  }, [specialCommand]);

  useEffect(() => {
    speechSynth.setVolume(value);
  }, [value]);

  const onClick = () => {
    speechSynth.speak(forecastMessage());
  };

  const onChange = (val) => {
    speechSynth.setVolume(val);
    setValue(val);
  };

  const settings = {
    start: 5,
    min: 0,
    max: 10,
    step: 1,
    smooth: true,
    onChange,
  };

  useEffect(() => {
    const commandList = SpecialPhrase[appLang.lang];
    for (const prop in commandList) {
      if (commandList[prop] === specialCommand.command) {
        let curValue = 0;
        switch (prop) {
          case 'Weather':
            speechSynth.speak(forecastMessage());
            break;
          case 'Forecast':
            break;
          case 'Louder':
            curValue = value + 1;
            onChange(curValue > settings.max ? settings.max : curValue);
            break;
          case 'Quiter':
            curValue = value - 1;
            onChange(curValue < settings.min ? settings.min : curValue);
            break;
          case 'Off':
            onChange(settings.min);
            break;
          case 'Max':
            onChange(settings.max);
            break;
          default:
            break;
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command]);


  return (
    <div className="wheather-widget__play-wrapper">
      <button
        type="button"
        className="circular ui icon button wheather-widget__play"
        onClick={onClick}
      >
        <i className="icon play" />
      </button>
      <Grid>
        <Grid.Column width={16}>
          <Slider discrete value={value} color="blue" settings={settings} />
        </Grid.Column>
      </Grid>
    </div>
  );
};

WheatherToday.propTypes = {
  appLang: PropTypes.shape({
    lang: PropTypes.string,
  }),
  forecastMessage: PropTypes.func,
  specialCommand: PropTypes.shape({
    command: PropTypes.string,
  }),
};

WheatherToday.defaultProps = {
  appLang: {
    lang: 'En',
  },
  forecastMessage: () => {},
  specialCommand: {
    command: '',
  },
};

export default WheatherToday;
