const messageUtils = require('../utils/message-utils')

const REGEX_ONLINE = /^Player ([\w\d*]+) is (?:online|Online)/
const REGEX_OFFLINE = /^Player ([\w\d]+) has been offline since(?: (\d+) months?)?(?: (\d+) days?)?(?: (\d+) hours?)?(?: (\d+) minutes?)?(?: (\d+) seconds?)?\.$/
const REGEX_NOT_FOUND = /^Error: Player not found/

const checkPlayerSeen = (bot, username, callback) => {
    const onMessage = (jsonMsg) => {
        const message = messageUtils.parseChatMessage(jsonMsg)

        if (isServerSeenResponse(message)) {
            console.log(message)

            let player

            if (playerIsOnline(message)) {
                player = getOnlinePlayerData(message, username)
            }

            else if (playerIsOffline(message)) {
                player = getOfflinePlayerData(message)
            }

            else if (playerNotFound(message)) {
                player = getPlayerNotFoundData(message, username)
            }

            stop()
            callback(player)
        }
    }

    const stop = () => {
        bot.removeListener('message', onMessage)
    }

    const start = () => {
        bot.on('message', onMessage)
        console.log('Sending chat message')
        setTimeout(() => bot.chat(`/seen ${username}`), messageUtils.MESSAGE_DELAY)
    }

    start()
}

const isServerSeenResponse = text => {
    return REGEX_ONLINE.test(text) || REGEX_OFFLINE.test(text) || REGEX_NOT_FOUND.test(text)
}

const playerIsOnline = text => {
    return REGEX_ONLINE.test(text)
}

const playerIsOffline = text => {
    return REGEX_OFFLINE.test(text)
}

const playerNotFound = text => {
    return REGEX_NOT_FOUND.test(text)
}

const getPlayerNotFoundData = (text, username) => {
    return {
        username,
        isOnline: false,
        lastSeen: null,
        isActive: false
    }
}

const getOfflinePlayerData = text => {
    const playerData = REGEX_OFFLINE.exec(text)
    const lastSeen = new Date(Date.now() - calculateMillisecondsOffline({
        months: playerData[2] && parseInt(playerData[2]),
        days: playerData[3] && parseInt(playerData[3]),
        hours: playerData[4] && parseInt(playerData[4]),
        minutes: playerData[5] && parseInt(playerData[5]),
        seconds: playerData[6] && parseInt(playerData[6])
    }))

    return {
        username: playerData[1],
        isOnline: false,
        lastSeen,
        isActive: determinePlayerActive(lastSeen)
    }
}

const getOnlinePlayerData = (text, username) => {
    return {
        username,
        isOnline: true,
        lastSeen: new Date(Date.now()),
        isActive: true
    }
}

const determinePlayerActive = (date) => {
    if (date === undefined) return false
    const twentyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)
    return twentyDaysAgo < date
}

const calculateMillisecondsOffline = lastSeen => {
    const secondsToMs = lastSeen['seconds'] ? lastSeen['seconds'] * 1000 : 0
    const minutesToMs = lastSeen['minutes'] ? lastSeen['minutes'] * 1000 * 60 : 0
    const hoursToMs = lastSeen['hours'] ? lastSeen['hours'] * 1000 * 60 * 60 : 0
    const daysToMs = lastSeen['days'] ? lastSeen['days'] * 1000 * 60 * 60 * 24 : 0
    const monthsToMs = lastSeen['months'] ? lastSeen['months'] * 1000 * 60 * 60 * 24 * 30 : 0

    return secondsToMs + minutesToMs + hoursToMs + daysToMs + monthsToMs;
}

module.exports = {
    checkPlayerSeen
}