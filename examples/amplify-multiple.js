
const Bits = require('../src/bits')
const a = Bits.fromNumber(2, 4)
const b = Bits.fromNumber(6, 4)
const c = Bits.fromNumber(10, 4)
const d = Bits.fromNumber(14, 4)

circuit(`amplify-multiple-input`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b)
.run()

circuit(`amplify-multiple-1-time`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b).mirror()
.run()

circuit(`amplify-multiple-2-times`, 5)
.h(0).h(1).h(2).h(3)
.flip(a).flip(b).mirror()
.flip(a).flip(b).mirror()
.run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [])
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
