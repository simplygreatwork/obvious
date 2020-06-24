
const math = require('mathjs')
const logger = require('../src/logger')()

// a classical implementation of Shor's algorithm
// basis: https://github.com/oreilly-qc/oreilly-qc.github.io/blob/master/samples/QCEngine/ch12_02_shor_no_qpu.js

if (true) run(15)
if (true) run(21)
if (true) run(51)

function run(semiprime) {
	
	logger.log()
	logger.log(`Now factoring the semiprime number ${semiprime}.`)
	var result = factor({ semiprime: semiprime, coprime: 2 })
	if (result) logger.log(`${result[0]} * ${result[1]} = ${semiprime}`)
	else logger.log(`Factoring failed because no non-trivial factors were found.`)
	logger.log()
}

function factor(options) {
	
	let {semiprime, coprime} = options
	let precision = decide_precision(semiprime)
	logger.log(`The precision needed is ${JSON.stringify(precision)} bits.`)
	let periods = decide_periods(semiprime, coprime, precision)
	logger.log(`The periods detected are ${JSON.stringify(periods)}.`)
	let factors = decide_factors(semiprime, coprime, periods)
	logger.log(`The decided factors are ${JSON.stringify(factors)}.`)
	return factors
}

function decide_precision(semiprime) {
	
	let result = 0
	let table = [
		{ semiprime: 15, precision: 4 },
		{ semiprime: 21, precision: 5 },
		{ semiprime: 35, precision: 6 },
		{ semiprime: 123, precision: 7 },
		{ semiprime: 341, precision: 8 },
		{ semiprime: 451, precision: 9 }
	]
	table.reverse().forEach(function(each) {
		if ((result === 0) && (semiprime >= each.semiprime)) {
			result = each.precision
		}
	}.bind(this))
	return result
}

function decide_periods(semiprime, coprime, precision) {
	
	let result = [0]
	let work = 1
	repeat(Math.pow(2, precision), function(index) {
		work = (work * coprime) % semiprime
		if (work === 1) {
			result = [index + 1]
			return 'break'
		}
	})
	return result
}

function decide_factors(semiprime, coprime, periods) {
	
	let result = null
	periods.forEach(function(period) {
		if (result) return
		let value = Math.pow(coprime, period / 2.0)
		let factor_a = math.gcd(semiprime, value - 1)
		let factor_b = math.gcd(semiprime, value + 1)
		if (factor_a * factor_b == semiprime) {
			if (factor_a != 1 && factor_b != 1) {
				result = [factor_a, factor_b]
			}
		}
	})
	return result
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
