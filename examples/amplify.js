
circuit('amplify-flip-input |  xx>', 5)
.h(0).h(1).h(2).h(3)
.flip()
.run()

circuit('amplify-flip-mirror |  xx>', 5)
.h(0).h(1).h(2).h(3)
.flip()
.mirror()
.run()

circuit('amplify-flip-mirror-twice |  xx>', 5)
.h(0).h(1).h(2).h(3)
.flip().mirror()
.flip().mirror()
.run()

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
