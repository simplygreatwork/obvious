
Circuit('unit-placing-every-qubit-into-superposition-a', 3)
.unit('all').h()
.circuit()
.run()

Circuit('unit-placing-every-qubit-into-superposition-b', 3)
.unit('*').h()
.circuit()
.run()

Circuit('unit-placing-every-qubit-into-superposition-c', 3)
.unit().h()
.circuit()
.run()

function Circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
