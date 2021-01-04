const loggingUtils = require('../utils/logging-utils');
const messageUtils = require('../utils/message-utils');
const servers = require('../servers/servers');
const regionApi = require('../api/region-api');

// region = {name, server}
const retrieveRegionInfo = (bot, regions) => {
  let server = servers.MAIN;
  curr = 0;
  end = regions.length - 1;

  const onMessage = (jsonMsg) => {
    if (messageUtils.noRegionFound(messageUtils.parseChatMessage(jsonMsg))) {
      loggingUtils.log(
        'No region could be found with the name: ' + regions[curr]['warp'],
        bot
      );

      if (allRegionDataGathered()) {
        stop();
        return;
      }

      curr += 1;

      if (shouldSwitchServers()) {
        servers.switchServers(bot, regions[curr]['server'], sendNextChat);
        return;
      }

      sendNextChat();
    }

    if (!isRegionInfo(jsonMsg)) {
      return;
    }

    const regionInfo = getRegionInfo(jsonMsg);
    regionInfo['name'] = regions[curr]['warp'];
    regionInfo['server'] = regions[curr]['server'];

    regionApi.addOrUpdateRegion(regionInfo);
    loggingUtils.log(regionInfo, bot);

    if (allRegionDataGathered()) {
      stop();
      return;
    }

    curr += 1;

    if (shouldSwitchServers()) {
      server = regions[curr]['server'];
      servers.switchServers(bot, regions[curr]['server'], sendNextChat);
      return;
    }

    sendNextChat();
  };

  const sendNextChat = () => {
    setTimeout(
      () => bot.chat(`/rg i ${regions[curr]['warp']}`),
      messageUtils.MESSAGE_DELAY
    );
  };

  const shouldSwitchServers = () => {
    return server !== regions[curr]['server'];
  };

  const allRegionDataGathered = () => {
    return curr == end;
  };

  const isRegionInfo = (msg) => {
    if (!msg['json']) {
      return false;
    }
    if (!msg['json']['extra'] || msg['json']['extra'].length <= 2) {
      return false;
    }
    if (
      !msg['json']['extra'][0]['extra'] ||
      msg['json']['extra'][0]['extra'].length <= 2
    ) {
      return false;
    }
    if (msg['json']['extra'][0]['extra'][2]['text'] !== 'Region Info') {
      return false;
    }
    return true;
  };

  const getRegionInfo = (msg) => {
    const regionNodes = msg['json']['extra'][2]['extra'];
    let regionInfo = {};

    for (let i = 0; i < regionNodes.length; i++) {
      if (regionNodes[i]['text'] === 'Owners: ') {
        if (regionNodes[i + 1]['extra'][0]['extra'] === undefined) {
          regionInfo['mayorNames'] = [];
        } else {
          regionInfo['mayorNames'] = regionNodes[i + 1]['extra'][0]['extra']
            .map((o) => o['text'])
            .filter((o) => o !== ', ');
        }
      }
    }

    for (let i = 0; i < regionNodes.length; i++) {
      if (regionNodes[i]['text'] === 'Bounds:') {
        const coordinates = messageUtils.parseCoordinatesLine(
          regionNodes[i + 1]['text'].trim()
        );
        regionInfo['iBounds'] = coordinates['iBounds'];
        regionInfo['oBounds'] = coordinates['oBounds'];
      }
    }

    return regionInfo;
  };

  const start = () => {
    bot.on('message', onMessage);
    sendNextChat();
  };

  const stop = () => {
    bot.removeListener('message', onMessage);
    console.log('completed');
  };

  if (regions.length === 0) {
    stop();
  }

  servers.switchServers(bot, servers.MAIN, start);
};

module.exports = {
  retrieveRegionInfo,
};
