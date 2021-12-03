const request = require("request");

const fetchMyIP = (callback) => {
  request(
    "https://api.ipify.org?format=json", 
    (err, response, body) => {
    if (err) {
      return callback(err, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP: ${body}`;
      return callback(Error(msg), null);
    }
    const obj = JSON.parse(body);
    callback(null, obj.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(
    `https://freegeoip.app/json/${ip}`, 
    (err, response, data) => {
    if (err) {
      return callback(err, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching coordinates for IP: ${ip}. Response: ${data}`;
      return callback(Error(msg), null);
    }

    const { latitude, longitude } = JSON.parse(data);
    return callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  request(
    `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      } else if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching flyover times with coordinates ,  Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const data = JSON.parse(body);

      callback(null, data.response);
    }
  );
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, times) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, times);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
