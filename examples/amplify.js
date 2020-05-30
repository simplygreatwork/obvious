
const utility = require('../src/utility')
const state = 12

// todo: the output |  xx> needs to mirror desired state to flip
// todo: actually create the state by parsing a bit string instead: '0011'

circuit('amplify-input |  xx>', 5)
.h(0).h(1).h(2).h(3)
.flip(state)
.run()

circuit('amplify-output-1-time |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(1, function() {
	this.flip(state).mirror()
}).run()

circuit('amplify-output-2-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(2, function() {
	this.flip(state).mirror()
}).run()

circuit('amplify-output-9-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(9, function() {
	this.flip(state).mirror()
}).run()

circuit('amplify-output-15-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(15, function() {
	this.flip(state).mirror()
}).run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		flip: function(value) {
			
			return this
			.toggle(value)
			.ccx(scratch(0), [0, 1])
			.h(3)
			.ccx(3, [scratch(0), 2])
			.h(3)
			.ccx(scratch(0), [0, 1])
			.toggle(value)
		},
		
		toggle: function(value) {
			
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
