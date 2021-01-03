const mineflayer = require('mineflayer');
const servers = require('./servers/servers');
const regionApi = require('./api/region-api');
const signScanner = require('./signs/sign-scanner');
const signsApi = require('./api/signs-api');
const loggingUtils = require('./utils/logging-utils');

const PROPERTIES = {
  host: process.env.MC_HOST,
  port: process.env.MC_PORT,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  version: process.env.MC_VERSION,
  checkTimeoutInterval: 2 * 60 * 60 * 1000,
};

const updateShopSigns = () => {
  let server = '';
  let regions = [];
  let curr = 0;
  let end = -1;

  let bot = mineflayer.createBot(PROPERTIES);

  const onSignsScanned = (signs) => {
    signsApi
      .addSigns({
        server,
        regionName: regions[curr]['name'],
        signs,
      })
      .then((response) => loggingUtils.log(response, bot));

    if (curr === end) {
      stop();
      return;
    }

    curr += 1;
    teleport(regions[curr]);
  };

  const onChunksLoaded = () => {
    loggingUtils.log('Chunks have loaded - will scan in 30s.', bot);
    setTimeout(
      () => signScanner.scanSigns(bot, regions[curr], onSignsScanned),
      signScanner.TIME_TO_WAIT_BEFORE_SCAN
    );
  };

  const teleport = (region) => {
    if (shouldSwitchServers(region)) {
      loggingUtils.log('Switching to server ' + region['server'], bot);
      server = region['server'];
      servers.switchServers(bot, region['server'], () => teleport(region));
    } else {
      loggingUtils.log(
        'Teleporting to ' + region['name'] + ' on ' + region['server'],
        bot
      );
      bot.chat('/warp ' + region['name']);
      setTimeout(() => bot.waitForChunksToLoad(onChunksLoaded), 2000);
    }
  };

  const shouldSwitchServers = (region) => {
    return server !== region['server'];
  };

  const start = () => {
    teleport(regions[curr]);
  };

  const stop = () => {
    loggingUtils.log('Completed', bot);
  };

  const getRegions = () => {
    regionApi
      .getActiveRegions()
      .then((response) => {
        regions = response;
        end = response.length - 1;
      })
      .then(start);
  };

  bot.once('spawn', getRegions);
};

module.exports = {
  updateShopSigns,
};
