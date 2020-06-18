
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

bits = Bits.fromString('0000')
logger.log('bits.endian: ' + bits.endian())
bits.flip(0)
logger.log('little endian bits: ' + bits)

bits = Bits.fromString('0000')
bits.endian('big')
bits.flip(0)
logger.log('big endian bits: ' + bits)

bits = Bits.fromNumber(1, 4)
logger.log('bits: ' + bits)
logger.log('array: ' + bits.toArray())

bits = Bits.fromNumber(9, 4)
logger.log('bits: ' + bits)
logger.log('bits.invert().toString(): ' + bits.invert().toString())
