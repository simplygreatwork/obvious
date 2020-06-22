
const math = require('mathjs')
const logger = require('../src/logger')()

// basis: https://github.com/oreilly-qc/oreilly-qc.github.io/blob/master/samples/QCEngine/ch12_02_shor_no_qpu.js
// a work in progress - not yet complete

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
	
	let {semiprime, coprime} = options
	let precision = decide_precision(semiprime)
	logger.log(`The precision needed is ${JSON.stringify(precision)} bits.`)
	let period = decide_period(semiprime, precision, coprime)
	logger.log(`The periods detected are ${JSON.stringify(period)}.`)
	let candidates = decide_candidates(period, semiprime, coprime)
	logger.log(`The candidate factors are ${JSON.stringify(candidates)}.`)
	let factors = decide_factors(candidates, semiprime)
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

function decide_period(semiprime, precision, coprime) {
	
	let period = null
	if (true) period = quantum_decide_period(semiprime, precision, coprime)
	if (true) period = classical_decide_period(semiprime, precision, coprime)
	return period
}

function classical_decide_period(semiprime, precision, coprime) {
	
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

function quantum_decide_period(semiprime, precision, coprime) {
	
	let size = quantum_decide_size(semiprime, precision)
	let circuit = Circuit('finding the period', size.total)
	let number = circuit.number(size.number)
	logger.log(`The work length is ${number.length} bits.`)
	precision = circuit.precision(size.number, size.precision)
	logger.log(`The precision length is ${precision.length} bits.`)
	number.populate(precision)
	precision.qft()
	circuit.run()
	let result = precision.result()
	logger.log(`The circuit result is ${result}.`)
	return quantum_estimate_spikes(result, 1 << precision.length)
}

function quantum_decide_size(semiprime, precision) {
	
	let number = 1
	while ((1 << number) < semiprime) number++
	if (semiprime != 15) number++
	return { number: number, precision: precision, total: number + precision}
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
		
		number: function(size) {
			
			let unit = this.unit(0, size)
			unit.x(0)
			
			return Object.assign(unit, {
				
				populate: function(precision) {
					
					repeat(precision.length, function(index) {
						var shifts = 1 << index
						var condition = precision.bits(shifts)
						shifts = shifts % this.length
						this.rollLeft(shifts, condition)
					}.bind(this))
				},
				
				rollLeft: function(shifts, condition) {
					return
				}
			})
		},
		
		precision: function(index, length) {
			
			let unit = this.unit(index, length)
			unit.write(0)
			unit.h()
			
			return Object.assign(unit, {
				
				bits: function() {
					return 0
				},
				
				result: function() {
					return this.read_() & ((1 << this.length) - 1)
				},
				
				read_: function() {
					return 0
				},
				
				qft: function() {
					if (false) this.circuit().qft()		// todo: a range only
				}
			})
		},
		
		qft: function() {
			
			this.repeat(this.size, function(index) {
				let inverse = this.size - 1 - index
				this.h(inverse)
				for (let j = inverse - 1; j >= 0; j--) {
					this.cu1(inverse, j, { lambda: 'pi / ' + Math.pow(2, inverse - j) })
				}
			}.bind(this))
			for (let i = 0, length = Math.floor(this.size / 2); i < length; i++) {
				this.swap(i, this.size - (i + 1))
			}
			return this
		},
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [i])
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
		var numerator = Math.round(denominator * actual)
		var estimated = numerator / denominator
		var error = Math.abs(estimated - actual)
		e0 = e1
		e1 = e2
		e2 = error
		if ((e1 <= best_error) && (e1 < e0) && (e1 < e2)) {
			var period = denominator - 1
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
