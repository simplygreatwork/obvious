
const utility = require('../src/utility')

let value = 3
console.log('value: ' + value)
value = utility.number_to_bits(value, 8)
console.log('value: ' + value)
value = utility.bits_to_number(value)
console.log('value: ' + value)
