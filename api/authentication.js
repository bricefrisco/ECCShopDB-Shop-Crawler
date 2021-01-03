const fetch = require('node-fetch');

let token = undefined;
let token_expires = undefined;

const getToken = () => {
  return new Promise((resolve, reject) => {
    // Generate new token if we haven't already or if it's expired
    if (token_expires === undefined || token_expires <= new Date()) {
      fetchToken().then((response) => {
        token = 'Bearer ' + response.token;
        token_expires = new Date(new Date().getTime() + 14 * 60000);
        resolve(token);
        return;
      });
    } else {
      resolve(token);
    }
  });
};

const fetchToken = () => {
  console.log('fetching token');
  return fetch(process.env.API_ENDPOINT + '/api/v3/authentication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    }),
  }).then((response) => response.json());
};

module.exports = {
  getToken,
};
