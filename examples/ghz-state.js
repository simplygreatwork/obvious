
const logger = require('../src/logger')()

circuit('Greenberger–Horne–Zeilinger state', 3)
.h(0)
.cx(1, 0)
.cx(2, 1)
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
