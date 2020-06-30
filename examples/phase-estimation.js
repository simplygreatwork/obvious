
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
			
			let reps = 1
			let unit = this.unit(0, this.size - 1)
			repeat(unit.length, function(index) {
				let target = unit.length
				let control = index
				this.crz(target, control, { phi : `${value} * -pi / 8 * ${reps}`})
				this.cx(target, control)
				this.crz(target, control, { phi : `${value} * -pi / 4 * ${reps}`})
				this.cx(target, control)
				this.crz(target, control, { phi : `${value} * -pi / 8 * ${reps}`})
				reps = reps * 2
			}.bind(this))
			return this
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
