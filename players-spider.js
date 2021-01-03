const mineflayer = require('mineflayer');
const playersApi = require('./api/players-api');
const lastSeenParser = require('./players/player-last-seen');
const serverSwitcher = require('./servers/servers');
const loggingUtils = require('./utils/logging-utils');

const PROPERTIES = {
  host: process.env.MC_HOST,
  port: process.env.MC_PORT,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  version: process.env.MC_VERSION,
  checkTimeoutInterval: 2 * 60 * 60 * 1000,
};

const updatePlayers = () => {
  let PLAYERS = [];
  let PLAYERS_NOT_FOUND = [];
  let curr = 0;
  let end = 0;
  let SERVER = 'main';

  let bot = mineflayer.createBot(PROPERTIES);

  const onPlayerParsed = (player) => {
    if (!player.lastSeen && !PLAYERS_NOT_FOUND.includes(player.username)) {
      PLAYERS_NOT_FOUND.push(player.username);
    }

    if (!player.lastSeen) {
      if (SERVER === 'main-east') {
        playersApi
          .updatePlayer(player)
          .then((response) => loggingUtils.log(response, bot));
      }
    } else {
      playersApi
        .updatePlayer(player)
        .then((response) => loggingUtils.log(response, bot));
    }

    curr++;
    if (curr === end) {
      onComplete();
      return;
    }

    lastSeenParser.checkPlayerSeen(bot, PLAYERS[curr], onPlayerParsed);
  };

  const start = () => {
    lastSeenParser.checkPlayerSeen(bot, PLAYERS[curr], onPlayerParsed);
  };

  const onComplete = () => {
    switch (SERVER) {
      case 'main':
        checkMainNorth();
        break;
      case 'main-north':
        checkMainEast();
        break;
      default:
        loggingUtils.log('Completed', bot);
    }
  };

  const checkMainNorth = () => {
    loggingUtils.log(
      'Checking main north for ' +
        PLAYERS_NOT_FOUND.length +
        ' unfound players.',
      bot
    );
    SERVER = 'main-north';
    PLAYERS = PLAYERS_NOT_FOUND;
    curr = 0;
    end = PLAYERS_NOT_FOUND.length;
    serverSwitcher.switchServers(bot, SERVER, start);
  };

  const checkMainEast = () => {
    loggingUtils.log(
      'Checking main east for ' +
        PLAYERS_NOT_FOUND.length +
        ' unfound players.',
      bot
    );
    SERVER = 'main-east';
    curr = 0;
    serverSwitcher.switchServers(bot, SERVER, start);
  };

  bot.once('spawn', () => {
    loggingUtils.log('Bot has spawned', bot);
    playersApi
      .fetchPlayers()
      .then((response) => {
        PLAYERS = response;
        curr = 0;
        end = response.length;
      })
      .then(() => {
        loggingUtils.log(
          'Fetched ' + PLAYERS.length + ' players to check.',
          bot
        );
        serverSwitcher.switchServers(bot, SERVER, start);
      });
  });
};

module.exports = {
  updatePlayers,
};
