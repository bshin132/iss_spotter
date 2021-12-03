const request = require("request-promise-native");

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

const fetchMyIP = () => {
  return request(
    "https://api.ipify.org?format=json");
};

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(
    `https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = (body) => {
  const data = JSON.parse(body);
  const result = {
    latitude: data.latitude,
    longitude: data.longitude,
  };
  return request(
    `https://iss-pass.herokuapp.com/json/?lat=${result.latitude}&lon=${result.longitude}`
  );
};

module.exports = { nextISSTimesForMyLocation };
