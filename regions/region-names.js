const messageUtils = require('../utils/message-utils')
const loggingUtils = require('../utils/logging-utils')
const servers = require('../servers/servers')
const regionInfo = require('./region-info')

const retrieveRegionNames = (bot) => {
	let server = servers.MAIN
	let warps = []


	let curr = 1;
	let end = 0;

	const onWarpsMessage = (jsonMsg) => {
		const message = messageUtils.parseChatMessage(jsonMsg);

		if (messageUtils.isWarpNamesMessage(message)) {
			const data = message.split(', ').map(warp => ({ warp, server }))
			warps.push(...data)
			loggingUtils.log(data, bot)

			if (allWarpsGatheredForServer()) {
				switchServers()
			}

			else {
				curr += 1;
				setTimeout(() => bot.chat(`/warp ${curr}`), messageUtils.MESSAGE_DELAY)
			}

		}

		else if (messageUtils.isWarpPageMessage(message)) {
			loggingUtils.log(message, bot)
			if (!end) end = messageUtils.getLastWarpPage(message)
		}
	}


	const switchServers = () => {
		switch (server) {
			case servers.MAIN:
				server = servers.MAIN_NORTH
				resetCounters()
				servers.switchServers(bot, servers.MAIN_NORTH, () => bot.chat('/warp'))
				break;
			case servers.MAIN_NORTH:
				server = servers.MAIN_EAST
				resetCounters()
				servers.switchServers(bot, servers.MAIN_EAST, () => bot.chat('/warp'))
				break
			default:
				stop();
		}
	}

	const resetCounters = () => {
		curr = 1
		end = 0
	}

	const allWarpsGatheredForServer = () => {
		return curr == end
	}

	const start = () => {
		bot.on('message', onWarpsMessage)
		servers.switchServers(bot, servers.MAIN, () => bot.chat('/warp'))
	}

	const stop = () => {
		bot.removeListener('message', onWarpsMessage)
		regionInfo.retrieveRegionInfo(bot, warps)
	}

	console.log('Starting in 5 seconds...')
	setTimeout(start, 5000)
}

module.exports = {
	retrieveRegionNames
}