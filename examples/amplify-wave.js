
const utility = require('../src/utility')
const state = 12
const wave = []

circuit('amplify-wave |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(27, function() {
	this.flip(state).mirror()
	this.peek(function(each, index) {
		if (index === 3) wave.push(each.probability)
	})
}).run()

console.log('wave: ' + JSON.stringify(wave, null, 2))

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
