
const logger = require('../src/logger')()
const Bits = require('../src/bits')

estimate(5)

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
	Circuit(`input for phase estimation of ${value} / ${Math.pow(2, size)}`, size + 1)
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
			.transform(0, 1, value)
			.transform(1, 2, value)
			.transform(2, 4, value)
		},
		
		transform: function(control, count, value) {
			
			return this
			.crz(3, control, { phi : `${value} * -pi / 8 * ${count}`})
			.cx(3, control)
			.crz(3, control, { phi : `${value} * -pi / 4 * ${count}`})
			.cx(3, control)
			.crz(3, control, { phi : `${value} * -pi / 8 * ${count}`})
		},
		
		qft_inverse: function(begin, length) {
			
			return this
			.swap(0, 2)
			.h(0)
			.crz(0, 1, { phi: 'pi / 2' })
			.crz(0, 2, { phi: 'pi / 4' })
			.h(1)
			.crz(1, 2, { phi: 'pi / 2' })
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
