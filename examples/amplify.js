
const logger = require('../src/logger')()
const Bits = require('../src/bits')

amplify(3)

function amplify(value) {
	
	const bits = Bits.fromNumber(3, 4)
	
	circuit(`the input state to amplify has its phase flipped |${bits.toString(' x')}>`, 5)
	.h(0).h(1).h(2).h(3)
	.flip(bits)
	.run()
	
	circuit(`the probability of the input state has been amplified 15 times |${bits.toString(' x')}>`, 5)
	.h(0).h(1).h(2).h(3)
	.repeat(15, function(index) {
		this.flip(bits).mirror()
	}).run()
}

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [i])
			}
			return this
		},
		
		flip: function(bits) {
			
			return this
			.toggle(bits)
			.ccx(scratch(0), [0, 1])
			.h(3)
			.ccx(3, [scratch(0), 2])
			.h(3)
			.ccx(scratch(0), [0, 1])
			.toggle(bits)
		},
		
		toggle: function(bits) {
			
			bits.toArray().forEach(function(bit, index) {
				if (bit) circuit.x(index)
			})
			return this
		},
		
		mirror: function() {
			return this.grover()
		},
		
		grover: function() {
			
			return this
			.h(0).h(1).h(2).h(3)
			.x(0).x(1).x(2).x(3)
			.ccx(scratch(0), [0, 1])
			.h(3)
			.ccx(3, [scratch(0), 2])
			.h(3)
			.ccx(scratch(0), [0, 1])
			.x(0).x(1).x(2).x(3)
			.h(0).h(1).h(2).h(3)
		}
	})
	
	return circuit
}

function main(index) {
	return index
}

function scratch(index) {
	return 4 + index 
}
