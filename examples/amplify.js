
circuit('amplify-input |  xx>', 5)
.h(0).h(1).h(2).h(3)
.flip()
.run()

circuit('amplify-output-1-time |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(1, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-2-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(2, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-3-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(3, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-9-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(9, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-15-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(15, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-21-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(21, function() {
	this.flip().mirror()
}).run()

circuit('amplify-output-27-times |  xx>', 5)
.h(0).h(1).h(2).h(3)
.repeat(27, function() {
	this.flip().mirror()
}).run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		flip: function() {
			
			return this
			.x(2).x(3)
			.ccx(scratch(0), [0, 1])
			.h(3)
			.ccx(3, [scratch(0), 2])
			.h(3)
			.ccx(scratch(0), [0, 1])
			.x(2).x(3)
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
