const fetch = require('node-fetch');
const authentication = require('./authentication');

const fetchRegions = (page = 1, regions = []) => {
  return fetch(
    process.env.API_ENDPOINT +
      `/api/v3/regions?active=true&page=${page}&pageSize=100`
  )
    .then((response) => response.json())
    .then((response) => {
      regions.push(...response.results);
      return response.currentPage === response.totalPages
        ? regions
        : fetchRegions(page + 1, regions);
    });
};

const getActiveRegions = () => {
  return fetchRegions()
    .then((response) =>
      response.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      })
    )
    .then((response) =>
      response.sort((a, b) => {
        if (a.server < b.server) return 1;
        if (a.server > b.server) return -1;
        return 0;
      })
    )
    .then((response) => {
      console.log('Retrieved ' + response.length + ' regions');
      return response;
    });
};

const addOrUpdateRegion = (region) => {
  checkRegion(region).then((response) => {
    if (!response) {
      postRegion(region)
        .then((response) => response.json())
        .then((response) => console.log(response));
    } else {
      putRegion(region)
        .then((response) => response.json())
        .then((response) => console.log(response));
    }
  });
};

const putRegion = (region) => {
  return new Promise((resolve, reject) => {
    authentication.getToken().then((token) => {
      fetch(process.env.API_ENDPOINT + '/api/v3/regions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(region),
      }).then((response) => resolve(response));
    });
  });
};

const postRegion = (region) => {
  return new Promise((resolve, reject) => {
    authentication.getToken().then((token) => {
      fetch(process.env.API_ENDPOINT + '/api/v3/regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(region),
      }).then((response) => resolve(response));
    });
  });
};

const checkRegion = (region) => {
  return fetch(
    process.env.API_ENDPOINT +
      `/api/v3/regions/${region['server']}/${region['name']}?sendAnalytics=false`
  ).then((response) => {
    return response.status !== 404;
  });
};

module.exports = {
  addOrUpdateRegion,
  getActiveRegions,
};
