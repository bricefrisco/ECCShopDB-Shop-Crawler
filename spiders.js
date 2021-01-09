const regionsSpider = require('./region-spider');
const playersSpider = require('./players-spider');
const shopSignsSpider = require('./shopsigns-spider');
const cron = require('node-cron');

console.log('Scheduling tasks.');

cron.schedule('0 5,9,13,15,17,19,21,23,1,3 * * *', () => {
  console.log('Scheduler for updating chest shops has started.');
  shopSignsSpider.updateShopSigns();
});

cron.schedule('0 7 * * *', () => {
  console.log('Scheduler for updating regions has started.');
  regionsSpider.updateRegions();
});

cron.schedule('0 11 * * *', () => {
  console.log('Scheduler for updating players has started.');
  playersSpider.updatePlayers();
});
