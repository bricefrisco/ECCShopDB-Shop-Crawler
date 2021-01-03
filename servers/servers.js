const messageUtils = require('../utils/message-utils')

const MAIN = 'main'
const MAIN_NORTH = 'main-north'
const MAIN_EAST = 'main-east'

const switchServers = (bot, server, callback) => {
  const sendMessage = () => {
    switch (server) {
      case MAIN:
        setTimeout(() => bot.chat('/m'), messageUtils.MESSAGE_DELAY)
        break;
      case MAIN_NORTH:
        setTimeout(() => bot.chat('/mn'), messageUtils.MESSAGE_DELAY)
        break;
      case MAIN_EAST:
        setTimeout(() => bot.chat('/me'), messageUtils.MESSAGE_DELAY)
        break;
      default:
        return;
    }
  }

  const onServerSwitchMessage = (jsonMsg) => {
    if (messageUtils.isServerSwapMessage(jsonMsg)) {
      bot.removeListener('message', onServerSwitchMessage)
      callback()
    }
  }

  bot.on('message', onServerSwitchMessage)
  sendMessage();
}

module.exports = {
  MAIN,
  MAIN_NORTH,
  MAIN_EAST,
  switchServers
}