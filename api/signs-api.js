const fetch = require('node-fetch');
const authentication = require('./authentication');

const addSigns = (addSignsRequest) => {
  return new Promise((resolve, reject) => {
    authentication.getToken().then((token) => {
      fetch(`${process.env.API_ENDPOINT}/api/v3/chest-shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(addSignsRequest),
      })
        .then((response) => response.json())
        .then((response) => resolve(response));
    });
  });
};

module.exports = {
  addSigns,
};
