
const math = require('mathjs')
const logger = require('../src/logger')()

logger.log()
logger.log('Math.sqrt(-2): ' + Math.sqrt(-2))  	 // cannot find the square root of a negative number
logger.log('math.sqrt(math.complex(-2)): ' + math.sqrt(math.complex(-2)))
logger.log('math.sqrt(math.complex(2)): ' + math.sqrt(math.complex(2)))
logger.log()

logger.log('math.pi: ', math.pi)
const degree = math.pi / 180
logger.log('1 degree = math.pi / 180: ', degree, math.pi / 180)
logger.log('360 degrees = math.pi * 2: ', 360 * degree, math.pi * 2)
logger.log('180 degrees = math.pi: ', 180 * degree, math.pi)
logger.log('90 degrees = math.pi / 2: ', 90 * degree, math.pi / 2)
logger.log('45 degrees = math.pi / 4: ', 45 * degree, math.pi / 4)
logger.log('22.5 degrees = math.pi / 8: ', 22.5 * degree, math.pi / 8)
logger.log()
