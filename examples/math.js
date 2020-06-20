
const math = require('mathjs')
const logger = require('../src/logger')()

logger.log()
illustate_complex_numbers()
illustrate_angles()
illustrate_greatest_common_denominator()
illustrate_least_common_multiple()
logger.log()

function illustate_complex_numbers() {
	
	logger.log(`----------------------------------------------`)
	logger.log(`Math.sqrt(-2) = ${Math.sqrt(-2)}`)		// cannot find the square root of a negative number
	logger.log(`math.sqrt(math.complex(-2)) = ${math.sqrt(math.complex(-2))}`)
	logger.log(`math.sqrt(math.complex(2)) = ${math.sqrt(math.complex(-2))}`)
}

function illustrate_angles() {
	
	logger.log('----------------------------------------------')
	const degree = math.pi / 180
	logger.log(`360 degrees = math.pi * 2 = ${360 * degree} = ${math.pi * 2}`)
	logger.log(`180 degrees = math.pi = ${180 * degree} = ${math.pi}`)
	logger.log(`90 degrees = math.pi / 2 = ${90 * degree} = ${math.pi / 2}`)
	logger.log(`45 degrees = math.pi / 4 = ${45 * degree} = ${math.pi / 4}`)
	logger.log(`22.5 degrees = math.pi / 8 = ${22.5 * degree} = ${math.pi / 8}`)
	logger.log(`1 degree = math.pi / 180 = ${degree} = ${math.pi / 180}`)
}

function illustrate_greatest_common_denominator() {
	
	logger.log()
	logger.log(`----------------------------------------------`)
	logger.log(`math.gcd(8, 12) = ${math.gcd(8, 12)}`)
	logger.log(`math.gcd(-4, 6) = ${math.gcd(-4, 6)}`)
	logger.log(`math.gcd(25, 15, -10) = ${math.gcd(25, 15, -10)}`)
}

function illustrate_least_common_multiple() {
	
	logger.log()
	logger.log(`----------------------------------------------`)
	logger.log(`math.lcm(4, 6) = ${math.lcm(4, 6)}`)
	logger.log(`math.lcm(6, 21) = ${math.lcm(6, 21)}`)
	logger.log(`math.lcm(6, 21, 5) = ${math.lcm(6, 21, 5)}`)
}

function illustrate_power_modulus() {
	
	logger.log()
	logger.log(`----------------------------------------------`)
}