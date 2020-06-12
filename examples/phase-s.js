
const logger = require('../src/logger')()

circuit('phase-s', 1)
.x(0)
.s(0)
.s(0)
.s(0)
.s(0)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
