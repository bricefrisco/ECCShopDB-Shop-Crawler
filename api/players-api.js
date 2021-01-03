const fetch = require('node-fetch');
const authentication = require('./authentication');

const fetchPlayers = (page = 1, players = []) => {
  return fetch(
    `${process.env.API_ENDPOINT}/api/v3/players?page=${page}&pageSize=100`
  )
    .then((response) => response.json())
    .then((response) => {
      players.push(...response.results.map((player) => player.name));
      return response.currentPage === response.totalPages
        ? players
        : fetchPlayers(page + 1, players);
    });
};

const updatePlayer = (player) => {
  return new Promise((resolve, reject) => {
    authentication.getToken().then((token) => {
      fetch(process.env.API_ENDPOINT + '/api/v3/players', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          name: player.username,
          active: player.isActive,
          lastSeen: player.lastSeen,
        }),
      })
        .then((response) => response.json())
        .then((response) => resolve(response));
    });
  });
};

module.exports = {
  fetchPlayers,
  updatePlayer,
};
