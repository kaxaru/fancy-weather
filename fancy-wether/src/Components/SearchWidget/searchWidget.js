/* eslint-disable linebreak-style */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Dictaphone from './SpeechRecognition/speechRecognition';

import { Vocabulary, SpecialPhrase } from '../../Data/vocabulary';

const SearchWidget = ({
  appLang, userQuery, setSpecialCommand, changeBG,
}) => {
  const input = useRef(null);
  const onKeyUp = (e) => {
    if (e.which === 13) {
      userQuery(input.current.value);
      changeBG();
    }
  };

  const onClick = () => {
    userQuery(input.current.value);
    changeBG();
  };

  const getSpeechQuery = (value) => {
    const phrase = SpecialPhrase[appLang.lang];
    let checkedPhrase = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in phrase) {
      if (phrase[prop] === value) {
        setSpecialCommand({ command: value });
        checkedPhrase = true;
        break;
      }
    }

    if (!checkedPhrase) {
      userQuery(value);
      changeBG();
    }
  };

  return (
    <div className="ui action input search-panel">
      <input type="text" ref={input} onKeyUp={onKeyUp} placeholder={Vocabulary[appLang.lang].SearchPanelPlaceholder} />
      <Dictaphone getSpeechQuery={getSpeechQuery} setInputValue={input} />
      <button
        type="button"
        className="ui right labeled icon button search-panel__button"
        onClick={onClick}
      >
        <i className="search icon" />
        {Vocabulary[appLang.lang].SearchPanel}
      </button>
    </div>
  );
};

SearchWidget.propTypes = {
  appLang: PropTypes.shape({
    lang: PropTypes.string,
  }),
  userQuery: PropTypes.func,
  setSpecialCommand: PropTypes.func,
  changeBG: PropTypes.func,
};

SearchWidget.defaultProps = {
  appLang: {
    lang: 'En',
  },
  userQuery: () => {},
  setSpecialCommand: () => {},
  changeBG: () => {},
};

export default SearchWidget;
