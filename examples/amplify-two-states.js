
const logger = require('../src/logger')()
const Bits = require('../src/bits')
const a = Bits.fromNumber(2, 4)
const b = Bits.fromNumber(6, 4)
const c = Bits.fromNumber(10, 4)
const d = Bits.fromNumber(14, 4)

circuit(`the input for amplifying two states`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b)
.run()

circuit(`amplify two states one time`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b).mirror()
.run()

circuit(`amplify two states two times`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b).mirror()
.flip(a).flip(b).mirror()
.run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
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
