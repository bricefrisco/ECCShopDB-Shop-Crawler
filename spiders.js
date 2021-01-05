const regionsSpider = require('./region-spider');
const playersSpider = require('./players-spider');
const shopSignsSpider = require('./shopsigns-spider');
const cron = require('node-cron');

console.log('Scheduling tasks.');

cron.schedule('34 0,4,8,10,12,14,16,18,20,21 * * *', () => {
  console.log('Scheduler for updating chest shops has started.');
  shopSignsSpider.updateShopSigns();
});

cron.schedule('0 2 * * *', () => {
  console.log('Scheduler for updating regions has started.');
  regionsSpider.updateRegions();
});

cron.schedule('0 6 * * *', () => {
  console.log('Scheduler for updating players has started.');
  playersSpider.updatePlayers();
});
