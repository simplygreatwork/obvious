
const logger = require('../src/logger')()
const Bits = require('../src/bits')

estimate(1)

function estimate(value) {
	
	input(value)
	output(value)
}

function input(value) {
	
	let size = 3
	Circuit(`input for phase estimation of ${value} / ${Math.pow(2, size)}`, size + 1)
	.unit(0, 3).h().circuit()
	.encode(value)
	.run()
}

function output(value) {
	
	let size = 3
	Circuit(`output for phase estimation of ${value} / ${Math.pow(2, size)}`, size + 1)
	.unit(0, 3).h().circuit()
	.encode(value)
	.qft_inverse()
	.run()
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
		
		encode: function(value) {
			
			return this
			.cu(3, 2, value)
			.cu(3, 1, value)
			.cu(3, 1, value)
			.cu(3, 0, value)
			.cu(3, 0, value)
			.cu(3, 0, value)
			.cu(3, 0, value)
		},
		
		cu: function(target, control, value) {
			
			return this
			.u1(target, [], { lambda: `-${value} * pi / 4` })
			.cx(target, control)
			.u1(target, [], { lambda: `${value} * pi / 4` })
			.cx(target, control)
		},
		
		qft_inverse: function(begin, length) {
			
			return this
			.h(0)
			.cu1(1, 0, { lambda: '-1 * pi / 2' })
			.h(1)
			.cu1(2, 0, { lambda: '-1 * pi / 4' })
			.cu1(2, 1, { lambda: '-1 * pi / 2' })
			.h(2)
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
