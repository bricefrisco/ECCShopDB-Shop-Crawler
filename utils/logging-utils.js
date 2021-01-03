const SHUTDOWN_AFTER_INACTIVITY_INTERVAL = 60 * 1000
let abort

const log = (message, bot) => {
  if (abort) clearTimeout(abort)
  abort = setTimeout(() => shutdown(bot), SHUTDOWN_AFTER_INACTIVITY_INTERVAL)
  console.log(message)
}

const shutdown = (bot) => {
  console.log('No activity in 60 seconds. Shutting down...')
  bot.end();
}

module.exports = {
  log
}