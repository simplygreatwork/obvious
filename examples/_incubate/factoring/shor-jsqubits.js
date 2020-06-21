
// origin: https://github.com/davidbkemp/jsqubits/blob/master/examples/algorithms/factoring.js

import Q from '../../lib'

const math = Q.QMath

function factor(semiprime) {
	
	if (semiprime % 2 === 0) return 2
	var power_factor = math.powerFactor(semiprime)
	if (power_factor > 1) return power_factor
	for (var attempts = 0; attempts < 8; attempts++) {
		var random = 2 + Math.floor(Math.random() * (semiprime - 2))
		var greatest_common_denominator = math.gcd(random, semiprime)
		if (greatest_common_denominator > 1) return greatest_common_denominator
		var result = compute_order(random, semiprime)
		if (result !== null) {
			if (result % 2 === 0) {
				var power_mod = math.powerMod(random, result / 2, semiprime)
				var greatest_common_denominator = math.gcd(power_mod - 1, semiprime)
				if ((greatest_common_denominator > 1) && (semiprime % greatest_common_denominator === 0)) {
					return greatest_common_denominator
				}
			}
		}
	}
	return null
}

function compute_order(random, semiprime) {
	
	var num_out_bits = Math.ceil(Math.log(semiprime) / Math.log(2))
	var num_in_bits = 2 * num_out_bits
	var out_range = Math.pow(2, num_out_bits)
	var in_range = Math.pow(2, num_in_bits)
	var out_bits = { from: 0, to: num_out_bits - 1 }
	var in_bits = { from: num_out_bits, to: num_out_bits + num_in_bits - 1 }
	var func = function (x) {
		return math.powerMod(random, x, semiprime)
	}
	var func_0 = func(0)
	
	function find_period(options) {
		
		let period = 1
		for (let index = 0; index < options.attempts; index++) {
			if (func(period) === func_0) return period
			let frequency = determine_frequency(func)
			const accuracy = 1 / (2 * out_range * out_range)
			let denominator = math.continuedFraction(frequency / in_range, accuracy).denominator
			if (denominator > 1 && denominator <= out_range) {
				if (func(denominator) === func_0) {
					period = denominator
				} else {
					var least_common_multiple = math.lcm(denominator, period)
					if (least_common_multiple <= out_range) {
						period = least_common_multiple
					}
				}
			}
		}
		return null
	}
	
	function determine_frequency(func) {
		
		let state = new Q.QState(num_in_bits + num_out_bits)
		.hadamard(in_bits)
		.applyFunction(in_bits, out_bits, func)
		.measure(out_bits).newState
		return state.qft(in_bits).measure(in_bits).result
	}
	
	return find_period({ attempts: num_out_bits * 2 })
}

let semiprime = 35
let result = factor(semiprime)
let factor_ = semiprime / result
console.log(`${semiprime} = ${result} * ${factor_}`)
