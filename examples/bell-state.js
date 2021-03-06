
const logger = require('../src/logger')()

circuit('Bell state', 2)
.h(0)
.cx(1, 0)
.run()

circuit('Bell state (opposite)', 2)
.h(0)
.cx(1, 0)
.x(0)
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
