const WARPS_PAGE_REGEX = /^There are (\d{1,5}) ECC warps\. Showing page (\d{1,3}) of (\d{1,3})\.$/
const WARP_NAMES_REGEX = /^(\w{1,25}, )+\w{1,25}$|^\w{1,25}$/
const COORDINATES_REGEX = /^\((-?\d+), (-?\d+), (-?\d+)\) -> \((-?\d+), (-?\d+), (-?\d+)\)$/
const NO_REGION_FOUND_REGEX = /^No region could be found with the name of '\w+'\.$/
const SERVER_SWAP_REGEX = /^\*\*Welcome to EcoCityCraft's \w+ Server\*\*$/
const SERVER_ALREADY_CONNECTED_REGEX = /.*You're already connected to \w+ server\.$/
const MESSAGE_DELAY = 1500

/**
 * GENERAL CHAT
 */
const parseChatMessage = jsonMsg => {
  arr = jsonMsg['extra']
  if (arr === undefined) return undefined;
  return arr.map(msg => msg['text']).join('')
}

/**
 * WARPS
 */

const isWarpNamesMessage = msg => {
  if (msg === undefined) return false;
  return WARP_NAMES_REGEX.test(msg)
}

const isWarpPageMessage = msg => {
  if (msg === undefined) return false;
  return WARPS_PAGE_REGEX.test(msg)
}

const getLastWarpPage = msg => {
  return WARPS_PAGE_REGEX.exec(msg)[3]
}

/**
 * SERVERS
 */

const isServerSwapMessage = msg => {
  console.log(msg['text'])
  return SERVER_SWAP_REGEX.test(msg) || SERVER_ALREADY_CONNECTED_REGEX.test(msg['text'])
}

/**
 * REGIONS
 */

const noRegionFound = msg => {
  return NO_REGION_FOUND_REGEX.test(msg)
}

const parseCoordinatesLine = msg => {
  const coords = COORDINATES_REGEX.exec(msg);
  return ({
    'iBounds': {
      'x': coords[1],
      'y': coords[2],
      'z': coords[3]
    },
    'oBounds': {
      'x': coords[4],
      'y': coords[5],
      'z': coords[6]
    }
  })
}

module.exports = {
  MESSAGE_DELAY,
  parseChatMessage,
  isWarpPageMessage,
  isServerSwapMessage,
  isWarpNamesMessage,
  getLastWarpPage,
  parseCoordinatesLine,
  noRegionFound
}