
circuit('set state \'a\' on qubit 1', 5)
.state_a(1)
.run()

circuit('set state \'a\' on qubit 2', 5)
.state_a(2)
.run()

circuit('set state \'a\' on source qubit 1 then teleport to destination qubit 2', 5)
.state_a(1)
.teleport(1, 2)
.measure(1, 2)
.run('trace', 'changed')

circuit('set state \'b\' on destination qubit 1', 5)
.state_b(1)
.run()

circuit('set state \'b\' on source qubit 4', 5)
.state_b(4)
.run()

circuit('set state \'b\' on source qubit 4 then teleport to destination qubit 1', 5)
.state_b(4)
.teleport(4, 1)
.measure(4, 1)
.run('trace', 'changed')

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		state_a: function(from) {
			return this.h(from).r4(from).h(from).r4(from).h(from)
		},
		
		state_b: function(from) {
			return this.h(from).r8(from).h(from).r4(from).h(from)
		},
		
		teleport: function(from, to) {
			
			let transport = 0
			return this
			.h(from)
			.h(to)
			.cx(transport, to)
			.cx(transport, from)
			.h(from)
			.cx(to, transport)
			.h(to)
			.cx(to, from)
		},
		
		measure: function(from, to) {
			return this.h(from).h(0)
		}
	})
	
	return circuit
}
