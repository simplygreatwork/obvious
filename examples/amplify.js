
const utility = require('../src/utility')
const Bits = require('../src/bits')
const bits = Bits.fromNumber(12, 4)

circuit(`amplify-input |${bits.toString(' x')}>`, 5)
.h(0).h(1).h(2).h(3)
.flip(bits)
.run()

circuit(`amplify-output-1-time |${bits.toString(' x')}>`, 5)
.h(0).h(1).h(2).h(3)
.repeat(1, function() {
	this.flip(bits).mirror()
}).run()

circuit(`amplify-output-2-times |${bits.toString(' x')}>`, 5)
.h(0).h(1).h(2).h(3)
.repeat(2, function() {
	this.flip(bits).mirror()
}).run()

circuit(`amplify-output-9-times |${bits.toString(' x')}>`, 5)
.h(0).h(1).h(2).h(3)
.repeat(9, function() {
	this.flip(bits).mirror()
}).run()

circuit(`amplify-output-15-times |${bits.toString(' x')}>`, 5)
.h(0).h(1).h(2).h(3)
.repeat(15, function() {
	this.flip(bits).mirror()
}).run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
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
			
			let value = bits.toNumber()
			utility.number_to_bits(value).reverse().forEach(function(bit, index) {
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
		},
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [])
			}
			return this
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
