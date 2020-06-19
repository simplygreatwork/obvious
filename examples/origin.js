
const logger = require('../src/logger')()

circuit('the origin state with 1 qubit', 1)
.run('dense')

circuit('the origin state with 3 qubits', 3)
.run('dense')

circuit('the origin state with 4 qubits', 4)
.run('dense')

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
