
const math = require('mathjs')
const logger = require('../src/logger')()

// basis: https://github.com/oreilly-qc/oreilly-qc.github.io/blob/master/samples/QCEngine/ch12_02_shor_no_qpu.js

if (true) run(15)
if (false) run(21)
if (false) run(51)

function run(semiprime) {
	
	logger.log()
	logger.log(`Now factoring the semiprime number ${semiprime}.`)
	var result = factor({ semiprime: semiprime, coprime: 2 })
	if (result) logger.log(`${result[0]} * ${result[1]} = ${semiprime}`)
	else logger.log(`Factoring failed because no non-trivial factors were found.`)
	logger.log()
}

function factor(options) {
	
	options.precision = decide_precision(options.semiprime)
	logger.log(`The precision needed is ${JSON.stringify(options.precision)} bits.`)
	let period = decide_period(options)
	logger.log(`The periods detected are ${JSON.stringify(period)}.`)
	let candidates = decide_candidates(period, options.semiprime, options.coprime)
	logger.log(`The candidate factors are ${JSON.stringify(candidates)}.`)
	let factors = decide_factors(candidates, options.semiprime)
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
	table.forEach(function(each) {
		if ((result == 0) && (semiprime >= each.semiprime)) {
			result = each.precision
		}
	}.bind(this))
	return result
}

function decide_period(options) {
	
	let result = [0]
	let work = 1
	repeat(Math.pow(2, options.precision), function(index) {
		work = (work * options.coprime) % options.semiprime
		if (work === 1) {
			result = [index + 1]
			return 'break'
		}
	})
	return result
}

function decide_candidates(periods, semiprime, coprime) {
	
	let result = []
	periods.forEach(function(period) {
		let value = Math.pow(coprime, period / 2.0)
		let factor_a = math.gcd(semiprime, value - 1)
		let factor_b = math.gcd(semiprime, value + 1)
		result.push([factor_a, factor_b])
	})
	return result
}

function decide_factors(candidates, semiprime) {
	
	let result = null
	candidates.forEach(function(factors) {
		if (result) return
		if (factors[0] * factors[1] == semiprime) {
			if (factors[0] != 1 && factors[1] != 1) {
				result = factors
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
