
const logger = require('../src/logger')()
const math = require('mathjs')

run(15)

function run(semiprime) {
	
	var result = Shor({semiprime: value, precision_bits: 6, coprime: 2})
	if (result !== null) {
		logger.log(`Success! ${semiprime} = ${result[0]} * ${result[1]}\n`)
	} else {
		logger.log(`Failure: No non-trivial factors were found.\n`)
	}
}

function Shor(options) {
	
	var repeat_period = ShorQPU(options)
	var factors = ShorLogic(options.semiprime, repeat_period, options.coprime)
	return check_result(N, factors)
}

function ShorQPU(options) {
	
	options.coprime = 2
	if (options.semiprime == 15 || options.semiprime == 21) {
		return ShorQPU_WithoutModulo(options)
	} else {
		return ShorQPU_WithModulo(options)
	}
}

function ShorQPU_WithoutModulo(options) {
	
	var N_bits = 1
	while ((1 << N_bits) < N) N_bits++
	if (N != 15) N_bits++
	var total_bits = N_bits + precision_bits
	qc.reset(total_bits)
	var num = qint.new(N_bits, 'work')
	var precision = qint.new(precision_bits, 'precision')
	num.write(1)
	precision.write(0)
	precision.hadamard()
	for (var i = 0; i < precision_bits; ++i) {
		var num_shifts = 1 << i
		var condition = precision.bits(num_shifts)
		num_shifts %= num.numBits
		num.rollLeft(num_shifts, condition)
	}
	precision.QFT()
	var read_result = read_unsigned(precision)
	qc.print('QPU read result: ' + read_result + '\n')
	var repeat_period_candidates = estimate_num_spikes(read_result, 1 << precision_bits)
	return repeat_period_candidates
}

function ShorQPU_WithModulo(options) {
	
	var scratch = null
	var max_value = 1
	var mod_engaged = false
	var N_bits = 1
	var scratch_bits = 0
	while ((1 << N_bits) < N) N_bits++
	if (N != 15) N_bits++
	scratch_bits = 1
	var total_bits = N_bits + precision_bits + scratch_bits
	qc.reset(total_bits);
	var num = qint.new(N_bits, 'work')
	var precision = qint.new(precision_bits, 'precision')
	var scratch = qint.new(1, 'scratch')
	num.write(1)
	precision.write(0)
	precision.hadamard()
	scratch.write(0)
	var N_sign_bit_place = 1 << (N_bits - 1)
	var N_sign_bit = num.bits(N_sign_bit_place)
	for (var i = 0; i < precision_bits; ++i) {
		var condition = precision.bits(1 << i)
		var N_sign_bit_with_condition = num.bits(N_sign_bit_place)
		N_sign_bit_with_condition.orEquals(condition)
		var shifts = 1 << i
		for (var shift = 0; shift < shifts; ++shift) {
			num.rollLeft(1, condition)
			max_value <<= 1
			if (max_value >= N) mod_engaged = true
			if (mod_engaged) {
				var wrap_mask = scratch.bits()
				var wrap_mask_with_condition = scratch.bits()
				wrap_mask_with_condition.orEquals(condition)
				// modulo code
				num.subtract(N, condition)
				scratch.cnot(N_sign_bit_with_condition)
				num.add(N, wrap_mask_with_condition)
				num.not(1)
				scratch.cnot(num, 1, condition)
				num.not(1)
			}
		}
	}
	precision.QFT()
	var read_result = read_unsigned(precision)
	logger.log('QPU read result: ${read_result}')
	var repeat_period_candidates = estimate_num_spikes(read_result, 1 << precision_bits)
	return repeat_period_candidates
}

function read_unsigned(qreg) {
	
	var value = qreg.read()
	return value & ((1 << qreg.numBits) - 1)
}

function estimate_num_spikes(spike, range) {
	
	if (spike < range / 2) spike = range - spike
	var best_error = 1.0
	var e0 = 0
	var e1 = 0
	var e2 = 0
	var actual = spike / range
	var candidates = []
	for (var denom = 1.0; denom < spike; ++denom) {
		var numerator = Math.round(denom * actual)
		var estimated = numerator / denom
		var error = Math.abs(estimated - actual)
		e0 = e1
		e1 = e2
		e2 = error
		if (e1 <= best_error && e1 < e0 && e1 < e2) {
			var repeat_period = denom - 1
			candidates.push(repeat_period)
			best_error = e1
		}
	}
	return candidates
}

function ShorLogic(N, repeat_period_candidates, coprime) {
	
	qc.print('Repeat period candidates: ' + repeat_period_candidates + '\n')
	factor_candidates = []
	for (var i = 0; i < repeat_period_candidates.length; ++i) {
		var repeat_period = repeat_period_candidates[i]
		var ar2 = Math.pow(coprime, repeat_period / 2.0)
		var factor1 = gcd(N, ar2 - 1)
		var factor2 = gcd(N, ar2 + 1)
		factor_candidates.push([factor1, factor2])
	}
	return factor_candidates
}

function check_result(N, factor_candidates) {
	
	for (var i = 0; i < factor_candidates.length; ++i) {
		var factors = factor_candidates[i]
		if (factors[0] * factors[1] == N) {
			if (factors[0] != 1 && factors[1] != 1) {
				return factors
			}
		}
	}
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
