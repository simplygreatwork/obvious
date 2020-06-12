
const logger = require('../src/logger')()

// once two qubits are entangled, what are some effects we can demo?
// if we rotate z on 0, will 1 also rotate on z? how can we verify this?
// how to compare and contrast entagled state vs non-entangled state?

circuit('entangle', 2)
.h(0)
.cx(1, 0)
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
