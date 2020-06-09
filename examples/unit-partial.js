
let circuit = Circuit('unit-of-one-qubit', 1)
let alice = circuit.unit(0)
alice.h()
circuit.run()

circuit = Circuit('unit-with-qubit-length-of-two', 2)
let pair = circuit.unit(0, 2)
pair.h()
circuit.run()

function Circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
