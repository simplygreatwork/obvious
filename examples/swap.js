
const logger = require('../src/logger')()

circuit('swap: before', 2)
.x(0)
.run('trace')

circuit('swap: after', 2)
.x(0)
.swap([0, 1])
.run('trace')

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
