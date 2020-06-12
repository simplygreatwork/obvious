
const logger = require('../src/logger')()

circuit('cx', 2)
.cx(1, 0)
.run('trace', 'changed')

circuit('x cx', 2)
.x(0)
.cx(1, 0)
.run('trace', 'changed')

circuit('x x cx', 2)
.x(0)
.x(0)
.cx(1, 0)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
