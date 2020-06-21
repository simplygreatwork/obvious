
shor_sample()

function shor_sample() {
	
    var N = 15
    var precision_bits = 4
    var coprime = 2
    var result = Shor(N, precision_bits, coprime)
    if (result !== null) {
        qc.print(`Success! ${N} = ${result[0]} * ${result[1]}\n`)
    } else {
        qc.print(`Failure: No non-trivial factors were found.\n`)
    }
}

function Shor(N, precision_bits, coprime) {
	
	var repeat_period = ShorNoQPU(N, precision_bits, coprime)		// quantum
	var factors = ShorLogic(N, repeat_period, coprime)					// classical
	return check_result(N, factors)
}

function ShorNoQPU(N, precision_bits, coprime) {

	var work = 1
	var max_loops = Math.pow(2, precision_bits)
	for (iter = 0; iter < max_loops; ++iter) {
		work = (work * coprime) % N
		if (work == 1) return [iter + 1]
	}
	return 0
}

function gcd(a, b) {
	
	while (b) {
		var m = a % b
		a = b
		b = m
	}
	return a
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

function ShorLogic(N, repeat_period_candidates, coprime) {
	
	qc.print(`Repeat period candidates: ${repeat_period_candidates}\n`)
	var factor_candidates = []
	for (var i = 0; i < repeat_period_candidates.length; ++i) {
		var repeat_period = repeat_period_candidates[i]
		var ar2 = Math.pow(coprime, repeat_period / 2.0)
		var factor1 = gcd(N, ar2 - 1)
		var factor2 = gcd(N, ar2 + 1)
		factor_candidates.push([factor1, factor2])
	}
	return factor_candidates
}

function estimate_num_spikes(spike, range) {
	
    if (spike < range / 2) spike = range - spike
    var best_error = 1.0
    var e0 = 0
    var e1 = 0
    var e2 = 0
    var actual = spike / range
    var candidates = []
    for (denom = 1.0; denom < spike; ++denom) {
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
