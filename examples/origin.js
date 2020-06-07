
circuit('origin-state-with-1-qubit', 1)
.run('dense')

circuit('origin-state-with-3-qubits', 1)
.run('dense')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'quantastica',
		order: ['targets', 'controls']
	})
}
