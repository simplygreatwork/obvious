
const logger = require('../src/logger')()

// This example is not yet verified for correctness; e.g. frequency = squared - state.index

frequency ({ period: 2, size: 4 })
frequency ({ period: 4, size: 4 })
frequency ({ period: 8, size: 4 })

function frequency(options) {
	
	input(options.period, options.size)
	output(options.period, options.size)
}

function input(period, size) {
	
	Circuit(`input-phases-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.run()
}

function output(period, size) {
	
	let result = { index: -1, magnitude: 0}
	Circuit(`output-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.qft(size)
	.run()
	.each(function(state) {
		if (state.magnitude > result.magnitude) result = state
	})
	let squared = Math.pow(2, size)
	logger.log(`The frequency is ${squared - result.index} from a period of ${period} in ${squared}.\n`)
}

function Circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		period: function(period) {
			
			return this
			.unit('all').h().circuit()
			.spread(function(index) {
				this.rz(index, [], { phi: 'pi / ' + period / 2 })
			})
		},
		
		spread: function(fn) {
			
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < 1 << i; j++) {
					fn.apply(this, [i])
				}
			}
			return this
		},
		
		qft: function() {
			return this.qft_4()
		},
		
		qft_4: function() {
			
			return this
			.h(3).cu1(3, 2, { lambda: "pi/2" })
			.h(2).cu1(3, 1, { lambda: "pi/4" }).cu1(2, 1, { lambda: "pi/2" })
			.h(1).cu1(3, 0, { lambda: "pi/8" }).cu1(2, 0, { lambda: "pi/4" }).cu1(1, 0, { lambda: "pi/2" })
			.h(0)
			.swap(0, 3)
			.swap(1, 2)
		}
	})
	
	return circuit
}
