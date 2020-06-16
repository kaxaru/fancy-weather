/* eslint-disable linebreak-style */
/* eslint-disable no-unreachable */
const getWheatherIcon = (id, isDay) => {
  switch (id) {
    case 1000:
      return (isDay) ? 'CLEAR_DAY' : 'CLEAR_NIGHT';
      break;
    case 1003:
      return (isDay) ? 'PARTLY_CLOUDY_DAY' : 'PARTLY_CLOUDY_NIGHT';
      break;
    case 1006:
      return 'CLOUDY';
      break;
    case 1009:
      return 'CLOUDY';
      break;
    case 1030:
      return 'FOG';
      break;
    case 1063:
      return 'RAIN';
      break;
    case 1066:
      return 'SNOW';
      break;
    case 1069:
      return 'RAIN';
      break;
    case 1072:
      return 'SNOW';
      break;
    case 1087:
      return 'RAIN';
      break;
    case 1114:
      return 'SNOW';
      break;
    case 1117:
      return 'SNOW';
      break;
    case 1135:
      return 'FOG';
      break;
    case 1147:
      return 'FOG';
      break;
    case 1150:
      return 'RAIN';
      break;
    case 1153:
      return 'SLEET';
      break;
    case 1168:
      return 'SNOW';
      break;
    case 1171:
      return 'SNOW';
      break;
    case 1180:
      return 'RAIN';
      break;
    case 1183:
      return 'RAIN';
      break;
    case 1186:
      return 'SLEET';
      break;
    case 1189:
      return 'SLEET';
      break;
    case 1192:
      return 'SLEET';
      break;
    case 1195:
      return 'RAIN';
      break;
    case 1198:
      return 'SNOW';
      break;
    case 1201:
      return 'RAIN';
      break;
    case 1204:
      return 'SLEET';
      break;
    case 1207:
      return 'RAIN';
      break;
    case 1210:
      return 'SNOW';
      break;
    case 1213:
      return 'SNOW';
      break;
    case 1216:
      return 'SNOW';
      break;
    case 1219:
      return 'SNOW';
      break;
    case 1222:
      return 'SNOW';
      break;
    case 1225:
      return 'SNOW';
      break;
    case 1237:
      return 'SLEET';
      break;
    case 1240:
      return 'SLEET';
      break;
    case 1243:
      return 'SLEET';
      break;
    case 1246:
      return 'SLEET';
      break;
    case 1249:
      return 'RAIN';
      break;
    case 1252:
      return 'RAIN';
      break;
    case 1255:
      return 'SNOW';
      break;
    case 1258:
      return 'SNOW';
      break;
    case 1261:
      return 'SLEET';
      break;
    case 1264:
      return 'SLEET';
      break;
    case 1273:
      return 'RAIN';
      break;
    case 1276:
      return 'RAIN';
      break;
    case 1279:
      return 'RAIN';
      break;
    case 1282:
      return 'RAIN';
      break;
    default:
      return 'RAIN';
      break;
  }
};

export default getWheatherIcon;
