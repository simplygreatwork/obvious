
const logger = require('../src/logger')()
const math = require('mathjs')

if (true) run(15)
if (false) run(21)

function run(semiprime) {
	
	// this might be incorrect (semiprime.toString(2).length)
	let precision = semiprime.toString(2).length
	var result = factor({semiprime: value, precision: precision, coprime: 2})
	if (result !== null) {
		logger.log(`${semiprime} = ${result[0]} * ${result[1]}\n`)
	} else {
		logger.log(`Failed: no non-trivial factors were found.\n`)
	}
}

function factor(options) {
	
	let period = find_period(options)
	console.log(`period: ${JSON.stringify(period)}`)
	var candidates = find_candidates(options.semiprime, repeat_period, options.coprime)
	let factors = find_factors(options.semiprime, candidates)
	return factors
}

function find_period(options) {
	
	let semiprime = options.semiprime
	let coprime = options.coprime
	let size = { number: 1, precision: options.precision }
	while ((1 << size.number) < semiprime) size.number++
	if (semiprime != 15) size.number++
	let circuit = Circuit('shor circuit', size.number + size.precision)
	let number = circuit.unit(0, size.number)
	let precision = circuit.unit(size.number, size.precision)
	number.write(1)
	precision.write(0)
	precision.h()
	for (var i = 0; i < size.precision; ++i) {
		var shifts = 1 << i
		var condition = precision.bits(shifts)
		shifts %= number.length
		number.rollLeft(shifts, condition)
	}
	precision.qft()
	circuit.run()
	let result = read_unsigned(precision)
	logger.log(`QPU read result: ${result}`)
	return estimate_spikes(result, 1 << size.precision)
}

function read_unsigned(unit) {
	
	return unit.read() & ((1 << unit.numBits) - 1)
}

function estimate_spikes(spike, range) {
	
	let result = []
	if (spike < range / 2) spike = range - spike
	let best_error = 1.0
	let e0 = 0
	let e1 = 0
	let e2 = 0
	let actual = spike / range
	for (let denominator = 1.0; denominator < spike; ++denominator) {
		var numerator = Math.round(denominator * actual)
		var estimated = numerator / denominator
		var error = Math.abs(estimated - actual)
		e0 = e1
		e1 = e2
		e2 = error
		if (e1 <= best_error && e1 < e0 && e1 < e2) {
			var period = denominator - 1
			result.push(period)
			best_error = e1
		}
	}
	return result
}

function find_candidates(semiprime, periods, coprime) {
	
	var result = []
	periods.forEach(function(period, index) {
		let value = Math.pow(coprime, periods / 2.0)
		let factor_a = math.gcd(semiprime, value - 1)
		let factor_b = math.gcd(semiprime, value + 1)
		result.push([factor_a, factor_b])
	})
	return result
}

function find_factors(semiprime, factors_) {
	
	factors_.forEach(function(factors, index) {
		if (factors[0] * factors[1] == semiprime) {
			if (factors[0] != 1 && factors[1] != 1) {
				return factors
			}
		}
	})
	return null
}

function gcd(a, b) {
	
	while (b) {
		var m = a % b
		a = b
		b = m
	}
	return a
}
