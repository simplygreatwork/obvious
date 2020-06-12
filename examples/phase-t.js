
const logger = require('../src/logger')()

circuit('phase-t', 1)
.x(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
