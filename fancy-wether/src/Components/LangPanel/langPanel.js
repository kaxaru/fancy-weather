/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'semantic-ui-react';

const langOption = [
  { key: 'En', text: 'en', value: 'En' },
  { key: 'Ru', text: 'ru', value: 'Ru' },
  { key: 'By', text: 'by', value: 'Be' },
];

const defaultLang = () => {
  if (localStorage.userLang === undefined) {
    return langOption[0];
  }
  const defLang = langOption.filter((lang) => lang.value === localStorage.userLang);
  return defLang[0];
};

const LangPanel = ({ userLang }) => {
  const [lang, setLang] = useState(defaultLang());
  const onChange = (e, data) => {
    localStorage.setItem('userLang', data.value);
    setLang(data.value);
    userLang(data.value);
  };
  return (
    <Dropdown
      button
      className="icon langpanel"
      floating
      labeled
      icon="world"
      options={langOption}
      search
      onChange={onChange}
      text={lang.text}
    />
  );
};

LangPanel.propTypes = {
  userLang: PropTypes.func,
};

LangPanel.defaultProps = {
  userLang: () => {},
};

export default LangPanel;
