/* eslint-disable linebreak-style */
const Synth = class Synth {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.volume = 0.5;
  }

  populateVoiceList(country = /UK/) {
    const timer = setInterval(() => {
      const voices = this.synth.getVoices();
      if (voices.length !== 0) {
        let tempVoices = [];
        if (country.length !== undefined) {
          country.forEach((c) => {
            tempVoices = [...tempVoices,
              ...voices.filter((langObj) => langObj.lang === c.lang && langObj.name === c.name)];
          });
          this.voices = tempVoices;
        } else {
          this.voices = voices.filter((lang) => country.test(lang.name));
        }
        const [voice] = this.voices;
        this.currentVoice = voice;
        clearInterval(timer);
      }
    }, 200);
  }

  isChangeListVoiceList(isChange = false) {
    if (this.currentVoice !== null) {
      return true;
    }
    return isChange;
  }

  setVoice(country) {
    let lang = '';
    if (country === 'Ru' || country === 'Be') {
      lang = 'ru-RU';
    } else {
      lang = 'en-GB';
    }
    const [voice] = this.voices
      .filter((langObj) => langObj.lang === lang);
    this.currentVoice = voice;
  }

  setVolume(volume) {
    this.volume = volume / 10;
  }

  speak(word, config = { pitch: 1, rate: 1 }) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    if (word !== undefined) {
      const utterThis = new SpeechSynthesisUtterance(word);
      utterThis.voice = this.currentVoice;
      utterThis.volume = this.volume;
      utterThis.pitch = config.pitch || 1;
      utterThis.rate = config.rate || 1;
      this.synth.speak(utterThis);
    }
  }
};

export default Synth;
