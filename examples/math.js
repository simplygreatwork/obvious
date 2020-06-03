
let math = require('mathjs')

console.log(Math.sqrt(-2))   // cannot find the square root of a negative number
console.log(math.sqrt(math.complex(-2)))
console.log(math.sqrt(math.complex(2)))
