
const logger = require('../src/logger')()

// seeking an example to clearly demonstrate interference
// this is probably not that example, not quite yet
// however, in this example global phase does even out to zero
// after two different qubits are rotated in opposite directions

circuit('interference', 2)
.h(0)
.h(1)
.rx(0, [], { theta: 'pi / 4' })
.rx(1, [], { theta: '-pi / 4' })
.h(0)
.h(1)
.run()

function circuit(name, size, options) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
