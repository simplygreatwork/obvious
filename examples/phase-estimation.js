
const logger = require('../src/logger')()
const Bits = require('../src/bits')

estimate({ degree: 45, size: 3 })
estimate({ degree: 22.5, size: 4 })
estimate({ degree: 11.25, size: 5 })

function estimate(options) {
	
	input(options.degree, options.size)
	output(options.degree, options.size)
}

function input(degree, size) {
	
	Circuit(`input for phase estimation of ${degree} degrees with a register unit precision of ${Math.pow(2, size)}`, size + 1)
	.unit(0, size).h().circuit()
	.encode(degree)
	.run()
}

function output(degree, size) {
	
	let circuit = Circuit(`output for phase estimation of ${degree} degrees with a register unit precision of ${Math.pow(2, size)}`, size + 1)
	let unit = circuit.unit(0, size)
	unit.h().circuit()
	.encode(degree)
	.qft_inverse(0, size)
	.run()
	let result = unit.measure().toNumber()
	degree = 360 * (result / Math.pow(2, size))
	logger.log(`The estimated phase is ${result}/${Math.pow(2, size)} of 360 degrees which is ${degree} degrees.`)
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
		
		encode: function(degree) {
			
			let reps = 1
			let length = this.size - 1
			let value = (Math.pow(2, length) * degree) / 360
			repeat(length, function(index) {
				let target = length
				let control = index
				let increment = Math.pow(2, length)
				this.crz(target, control, { phi : `${value} * -pi / ${increment} * ${reps}`})
				this.cx(target, control)
				this.crz(target, control, { phi : `${value} * -pi / ${increment / 2} * ${reps}`})
				this.cx(target, control)
				this.crz(target, control, { phi : `${value} * -pi / ${increment} * ${reps}`})
				reps = reps * 2
			}.bind(this))
			return this
		},
		
		qft_inverse: function(begin, length) {
			
			begin = begin || 0
			length = length || this.size
			for (let i = begin, length_ = Math.floor((begin + length) / 2); i < length_; i++) {
				this.swap(i, length - (i + 1))
			}
			repeat(length, function(index) {
				this.h(begin + index)
				for (let j = index + 1; j < length; j++) {
					this.cu1(j, index, { lambda: 'pi / ' + Math.pow(2, j - index) })
				}
			}.bind(this))
			return this
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
