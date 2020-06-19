
const logger = require('../src/logger')()

circuit('phase: z', 1)
.x(0)
.z(0)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
