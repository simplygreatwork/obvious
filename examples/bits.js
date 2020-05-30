
const utility = require('../src/utility')
const Bits = require('../src/bits')

let bits = null

bits = Bits.fromNumber(12, 4)
console.log('bits.toNumber(): ' + bits.toNumber())
console.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromNumber(3, 4)
console.log('bits.toNumber(): ' + bits.toNumber())
console.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromString('0101', '01')
console.log('bits.toNumber(): ' + bits.toNumber())
console.log('bits.toString("01"): ' + bits.toString('01'))

bits = Bits.fromString(' x x', ' x')
console.log('bits.toNumber(): ' + bits.toNumber())
console.log('bits.toString(" x"): ' + bits.toString(' x'))
console.log('bits.toString("01"): ' + bits.toString('01'))
