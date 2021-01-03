const mineflayer = require('mineflayer');
const regionNames = require('./regions/region-names');

const PROPERTIES = {
  host: process.env.MC_HOST,
  port: process.env.MC_PORT,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  version: process.env.MC_VERSION,
  checkTimeoutInterval: 2 * 60 * 60 * 1000,
};

console.log(PROPERTIES);

const updateRegions = () => {
  let bot = mineflayer.createBot(PROPERTIES);
  bot.on('kicked', (reason) => console.log('Bot kicked: ' + reason));
  bot.on('end', () => console.log('Bot disconnected.'));
  bot.on('error', (error) => console.log(error));
  bot.once('spawn', () => regionNames.retrieveRegionNames(bot));
};

module.exports = {
  updateRegions,
};

updateRegions();
