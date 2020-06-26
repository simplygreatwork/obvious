
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// incomplete

periods ({ frequency: 2, size: 4 })
periods ({ frequency: 4, size: 4 })
periods ({ frequency: 8, size: 4 })

function periods(options) {
	
	input(options.frequency, options.size)
	output(options.frequency, options.size)
}

function input(frequency, size) {
	
	Circuit(`input state for a frequency of ${frequency} using ${size} qubits`, size)
	.frequency(frequency)
	.run()
}

function output(frequency, size) {
	
	Circuit(`output for a frequency of ${frequency} using ${size} qubits`, size)
	.frequency(frequency)
	.qft_inverse(size)
	.run()
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
		
		frequency: function(frequency) {
			
			let bits = Bits.fromNumber(frequency, this.size)
			bits.iterate(function(bit, index) {
				if (bit) this.x(index) 
			}.bind(this))
			// this.x(2)
			return this
		},
		
		qft_inverse: function(size) {
			
			if (false) {
				return this.qft_dynamic()
			} else {
				return this['qft_inverse_' + this.size]()
			}
		},
		
		qft_inverse_4: function() {
			
			return this
			.swap(0, 3)
			.swap(1, 2)
			.h(0)
				.cu1(1, 0, { lambda: 'pi/2' })
				.cu1(2, 0, { lambda: 'pi/4' })
				.cu1(3, 0, { lambda: 'pi/8' })
			.h(1)
				.cu1(2, 1, { lambda: 'pi/2' })
				.cu1(3, 1, { lambda: 'pi/4' })
			.h(2)
				.cu1(3, 2, { lambda: 'pi/2' })
			.h(3)
		},
		
		qft_inverse_dynamic: function(begin, length) {
			return
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
