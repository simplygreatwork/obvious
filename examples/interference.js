
const logger = require('../src/logger')()

circuit('interference', 4)
.run()

function circuit(name, size, options) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
