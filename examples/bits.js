
const logger = require('../src/logger')()
const utility = require('../src/utility')
const Bits = require('../src/bits')

let bits = null

bits = Bits.fromNumber(12, 4)
logger.log('bits.toNumber(): ' + bits.toNumber())
logger.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromNumber(3, 4)
logger.log('bits.toNumber(): ' + bits.toNumber())
logger.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromString('0101', '01')
logger.log('bits.toNumber(): ' + bits.toNumber())
logger.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromString(' x x', ' x')
logger.log('bits.toNumber(): ' + bits.toNumber())
logger.log('bits.toString(" x"): ' + bits.toString(' x'))
logger.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromString('111000100001001', '01')
logger.log('bits.toNumber(): ' + bits.toNumber())
