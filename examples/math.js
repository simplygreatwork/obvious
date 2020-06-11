
let math = require('mathjs')

console.log()
console.log('Math.sqrt(-2): ' + Math.sqrt(-2))  	 // cannot find the square root of a negative number
console.log('math.sqrt(math.complex(-2)): ' + math.sqrt(math.complex(-2)))
console.log('math.sqrt(math.complex(2)): ' + math.sqrt(math.complex(2)))
console.log()

console.log('math.pi: ', math.pi)
const degree = math.pi / 180
console.log('1 degree = math.pi / 180: ', degree, math.pi / 180)
console.log('360 degrees = math.pi * 2: ', 360 * degree, math.pi * 2)
console.log('180 degrees = math.pi: ', 180 * degree, math.pi)
console.log('90 degrees = math.pi / 2: ', 90 * degree, math.pi / 2)
console.log('45 degrees = math.pi / 4: ', 45 * degree, math.pi / 4)
console.log('22.5 degrees = math.pi / 8: ', 22.5 * degree, math.pi / 8)
console.log()
