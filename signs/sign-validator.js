const NAME_LINE_PATTERN = /^\w+$/
const QUANTITY_LINE_PATTERN = /^Q [1-9][0-9]{0,4} : C [0-9]{0,5}$/
const MATERIAL_LINE_PATTERN = /^[\w _#:-]+$/

const BUY_SELL_LINE_REGEX = /^([BS])\s?([0-9.]+)\s?:\s?([BS])\s?([0-9.]+)$/
const BUY_LINE_REGEX = /^B\s?([0-9.]+)$/
const SELL_LINE_REGEX = /^S\s?([0-9.]+)$/

const signIsValid = (region, sign) => {
  return !signIsOutOfBounds(region, sign)
    && nameLineValid(sign['nameLine'])
    && quantityLineValid(sign['quantityLine'])
    && priceLineValid(sign['priceLine'])
    && materialLineValid(sign['materialLine'])
}

const nameLineValid = (nameLine) => {
  return NAME_LINE_PATTERN.test(nameLine)
}

const quantityLineValid = (quantityLine) => {
  return QUANTITY_LINE_PATTERN.test(quantityLine)
}

const materialLineValid = (materialLine) => {
  return MATERIAL_LINE_PATTERN.test(materialLine)
}

const priceLineValid = (priceLine) => {
  return BUY_SELL_LINE_REGEX.test(priceLine) || BUY_LINE_REGEX.test(priceLine) || SELL_LINE_REGEX.test(priceLine)
}

const signIsOutOfBounds = (region, sign) => {
  return isBetween(sign['location']['x'], region['iBounds']['x'], region['iBounds']['x'])
    && isBetween(sign['location']['y'], region['iBounds']['y'], region['oBounds']['y'])
    && isBetween(sign['location']['z'], region['iBounds']['z'], region['oBounds']['z'])
}

const isBetween = (a, y, z) => {
  return a >= min(y, z) && a <= max(y, z)
}

const min = (y, z) => {
  return y < z ? y : z
}

const max = (y, z) => {
  return y > z ? y : z
}

module.exports = {
  signIsValid
}