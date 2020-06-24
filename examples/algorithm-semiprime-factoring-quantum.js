
const math = require('mathjs')
const chalk = require('chalk')
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a quantum implementation of Shor's algorithm
// basis: https://github.com/oreilly-qc/oreilly-qc.github.io/blob/master/samples/QCEngine/ch12_01_shor1.js
// a work in progress - not yet complete - works with semiprimes 15 and 21 only

if (true) run(15)
if (true) run(21)
if (true) run(22)

function run(semiprime) {
	
	let result = null
	validate(semiprime)
	logger.log(`Now factoring the semiprime number ${semiprime}.`)
	const attempts = 10
	repeat(attempts, function(index) {
		result = factor({ semiprime: semiprime, coprime: 2 })
		if (result) logger.log(`${result[0]} * ${result[1]} = ${semiprime}`)
		if (result) return 'break'
		logger.log(chalk.red.bold(`No non-trivial factors were found.`))
	}.bind(this))
	if (! result) logger.log(chalk.red.bold(`Stopping after ${attempts} attempts.`))
}

function validate(semiprime) {
	
	if (! (semiprime === 15 || semiprime === 21)) {
		logger.log(chalk.red.bold(`Semiprime ${semiprime} is not supported. Currently only 15 and 21 are supported in this example.`))
		process.exit(0)
	}
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
		if ((result == 0) && (semiprime >= each.semiprime)) {
			result = each.precision
		}
	}.bind(this))
	return result
}

function decide_periods(semiprime, coprime, precision) {
	
	let period = null
	if (true) period = quantum_decide_period(semiprime, coprime, precision)
	if (false) period = classical_decide_period(semiprime, coprime, precision)
	return period
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
				return 'break'
			}
		}
	})
	return result
}

function classical_decide_period(semiprime, coprime, precision) {
	
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

function quantum_decide_period(semiprime, coprime, precision) {
	
	let size = quantum_decide_size(semiprime, precision)
	let circuit = Circuit('finding the period', size.total)
	let work = circuit.work(size.work, semiprime)
	logger.log(`The work length is ${work.length} bits.`)
	precision = circuit.precision(size.work, size.precision)
	logger.log(`The precision length is ${precision.length} bits.`)
	work.render(precision)
	precision.qft()
	circuit.run()
	let result = work.measure().toNumber()
	logger.log(`The quantum circuit result is ${result}.`)
	let periods = quantum_estimate_spikes(result, 1 << precision.length)
	logger.log(`The quantum periods are ${JSON.stringify(periods)}.`)
	return periods
}

function quantum_decide_size(semiprime, precision) {
	
	let work = 1
	while ((1 << work) < semiprime) work++
	if (semiprime != 15) work++
	return { work: work, precision: precision, total: work + precision}
}

function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		work: function(size, semiprime) {
			
			let unit = this.unit(0, size)
			unit.unit(0).x()
			
			return Object.assign(unit, {
				
				render: function(precision) {
					
					if (semiprime === 15) {
						return this.circuit()
						.cswap([2, 3], 4)
						.cswap([1, 2], 4)
						.cswap([0, 1], 4)
						.cswap([1, 3], 5)
						.cswap([0, 2], 5)
						.cswap([0, 1], 5)
					} else if (semiprime === 21) {
						return this.circuit()
						.cswap([4, 5], 6)
						.cswap([3, 4], 6)
						.cswap([2, 3], 6)
						.cswap([1, 2], 6)
						.cswap([0, 1], 6)
						.cswap([3, 5], 7)
						.cswap([2, 4], 7)
						.cswap([1, 3], 7)
						.cswap([0, 2], 7)
						.cswap([0, 1], 7)
						.cswap([1, 5], 8)
						.cswap([0, 4], 8)
						.cswap([0, 3], 8)
						.cswap([0, 2], 8)
						.cswap([0, 1], 8)
						.cswap([3, 5], 9)
						.cswap([2, 4], 9)
						.cswap([1, 3], 9)
						.cswap([0, 2], 9)
						.cswap([0, 1], 9)
						.cswap([1, 5], 10)
						.cswap([0, 4], 10)
						.cswap([0, 3], 10)
						.cswap([0, 2], 10)
						.cswap([0, 1], 10)
					}
				}
			})
		},
		
		precision: function(index, length) {
			
			let unit = this.unit(index, length)
			unit.h()
			
			return Object.assign(unit, {
				
				qft: function() {
					
					this.circuit().qft(index, length)
				},
			})
		},
		
		qft: function(begin, length) {
			
			begin = begin || 0
			length = length || this.size
			repeat(length, function(index) {
				let inverse = (begin + length) - 1 - (index)
				this.h(inverse)
				for (let j = inverse - 1; j >= begin; j--) {
					this.cu1(inverse, j, { lambda: 'pi / ' + Math.pow(2, inverse - j) })
				}
			}.bind(this))
			for (let i = begin, length_ = Math.floor((begin + length) / 2); i < length_; i++) {
				this.swap(i, length_ - (i + 1))
			}
			return this
		}
	})
}

function quantum_estimate_spikes(spike, range) {
	
	let result = []
	if (spike < range / 2) spike = range - spike
	let best_error = 1.0
	let e0, e1, e2 = 0
	let actual = spike / range
	for (let denominator = 1.0; denominator < spike; ++denominator) {
		let numerator = Math.round(denominator * actual)
		let estimated = numerator / denominator
		let error = Math.abs(estimated - actual)
		e0 = e1
		e1 = e2
		e2 = error
		if ((e1 <= best_error) && (e1 < e0) && (e1 < e2)) {
			let period = denominator - 1
			result.push(period)
			best_error = e1
		}
	}
	return result
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}

function fill(begin, length) {
	
	let result = []
	for (let i = begin; i < length; i++) {
		result.push(i)
	}
	return result
}
