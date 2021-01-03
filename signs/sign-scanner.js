const signValidator = require('./sign-validator')

const TIME_TO_WAIT_BEFORE_SCAN = 30 * 1000
const TRADE_SIGN_IDS = [155, 156, 157, 158, 159, 160, 165, 166, 167, 168, 169, 170, 722, 723, 724, 725]

const getInvalidSign = () => {
  return {
    location: {
      x: 0,
      y: 0,
      z: 0
    },
    nameLine: 'invalid',
    quantityLine: 'invalid',
    priceLine: 'invalid',
    materialLine: 'invalid'
  }
}

const convertSignData = (bot, sign) => {
  const signData = bot.blockAt(sign)
  if (!signData['signText']) {
    return getInvalidSign()
  }

  const signTextLines = signData['signText'].split('\n')
  if (signTextLines.length < 4) {
    return getInvalidSign()
  }

  const nameLine = signTextLines[0].trim()
  const quantityLine = signTextLines[1].trim()
  const priceLine = signTextLines[2].trim()
  const materialLine = signTextLines[3].trim()

  return {
    location: {
      x: sign['x'],
      y: sign['y'],
      z: sign['z']
    },
    nameLine,
    quantityLine,
    priceLine,
    materialLine
  }
}

const scanSigns = (bot, region, callback) => {
  let signs = bot.findBlocks({
    matching: TRADE_SIGN_IDS,
    maxDistance: 500,
    count: 50000
  })



  console.log(`Found ${signs.length} signs. Converting sign data...`)
  signs = signs.map(sign => convertSignData(bot, sign))

  console.log('Sign data converted. Validating signs...')
  signs = signs.filter(sign => signValidator.signIsValid(region, sign))

  console.log(`Found ${signs.length} valid signs.`)
  callback(signs)
}

module.exports = {
  scanSigns,
  TIME_TO_WAIT_BEFORE_SCAN
}