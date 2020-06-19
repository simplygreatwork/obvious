
const logger = require('../src/logger')()

let i = 0
circuit('apply superposition to individual qubits', 4)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.run('trace', 'changed')

circuit('apply superposition to qubits as a unit', 4)
.unit('all').h()
.circuit()
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
