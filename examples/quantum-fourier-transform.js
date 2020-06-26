
const logger = require('../src/logger')()

// This example is not yet verified for correctness
// e.g. frequency = squared - state.index
// this is a workspace to create a QFT algorithm for n-qubits: a circuit with a dynamic number of qubits

frequency ({ period: 2, size: 4 })
frequency ({ period: 4, size: 4 })
frequency ({ period: 8, size: 4 })
frequency ({ period: 2, size: 5 })
frequency ({ period: 4, size: 5 })
frequency ({ period: 8, size: 5 })
frequency ({ period: 2, size: 6 })
frequency ({ period: 4, size: 6 })
frequency ({ period: 8, size: 6 })
frequency ({ period: 4, size: 8 })

function frequency(options) {
	
	input(options.period, options.size)
	output(options.period, options.size)
}

function input(period, size) {
	
	Circuit(`input phases for a period of ${period} using ${size} qubits`, size)
	.period(period)
	.run()
}

function output(period, size) {
	
	let result = { index: -1, magnitude: 0}
	Circuit(`output for a period of ${period} using ${size} qubits`, size)
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
		
		qft: function(size) {
			
			if (true) {
				return this.qft_dynamic()
			} else {
				return this['qft_' + this.size]()
			}
		},
		
		qft_4: function() {
			
			return this
			.h(3)
				.cu1(3, 2, { lambda: "pi/2" })
			.h(2)
				.cu1(3, 1, { lambda: "pi/4" })
				.cu1(2, 1, { lambda: "pi/2" })
			.h(1)
				.cu1(3, 0, { lambda: "pi/8" })
				.cu1(2, 0, { lambda: "pi/4" })
				.cu1(1, 0, { lambda: "pi/2" })
			.h(0)
			.swap(0, 3)
			.swap(1, 2)
		},
		
		qft_5: function() {
			
			return this
			.h(4)
				.cu1(4, 3, { lambda: "pi/2" })
			.h(3)
				.cu1(4, 2, { lambda: "pi/4" })
				.cu1(3, 2, { lambda: "pi/2" })
			.h(2)
				.cu1(4, 1, { lambda: "pi/8" })
				.cu1(3, 1, { lambda: "pi/4" })
				.cu1(2, 1, { lambda: "pi/2" })
			.h(1)
				.cu1(4, 0, { lambda: "pi/16" })
				.cu1(3, 0, { lambda: "pi/8" })
				.cu1(2, 0, { lambda: "pi/4" })
				.cu1(1, 0, { lambda: "pi/2" })
			.h(0)
			.swap(0, 4)
			.swap(1, 3)
		},
		
		qft_6: function() {
			
			return this
			.h(5)
				.cu1(5, 4, { lambda: "pi/2" })
			.h(4)
				.cu1(5, 3, { lambda: "pi/4" })
				.cu1(4, 3, { lambda: "pi/2" })
			.h(3)
				.cu1(5, 2, { lambda: "pi/8" })
				.cu1(4, 2, { lambda: "pi/4" })
				.cu1(3, 2, { lambda: "pi/2" })
			.h(2)
				.cu1(5, 1, { lambda: "pi/16" })
				.cu1(4, 1, { lambda: "pi/8" })
				.cu1(3, 1, { lambda: "pi/4" })
				.cu1(2, 1, { lambda: "pi/2" })
			.h(1)
				.cu1(5, 0, { lambda: "pi/32" })
				.cu1(4, 0, { lambda: "pi/16" })
				.cu1(3, 0, { lambda: "pi/8" })
				.cu1(2, 0, { lambda: "pi/4" })
				.cu1(1, 0, { lambda: "pi/2" })
			.h(0)
			.swap(0, 5)
			.swap(1, 4)
			.swap(2, 3)
		},
		
		qft_dynamic: function(begin, length) {
			
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
				this.swap(i, length - (i + 1))
			}
			return this
		}
	})
	
	return circuit
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
