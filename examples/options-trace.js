
const logger = require('../src/logger')()

circuit('apply pauli-x gate to each qubit with tracing', 3)
.x(0)
.x(1)
.x(2)
.run('trace')

circuit('apply pauli-x gate to each qubit without tracing - display result at end', 3)
.x(0)
.x(1)
.x(2)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
