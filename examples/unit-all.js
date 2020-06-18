
const logger = require('../src/logger')()

Circuit(`a unit placing every qubit into superposition ('all')`, 3)
.unit('all').h()
.circuit()
.run()

Circuit(`a unit placing every qubit into superposition ('*')`, 3)
.unit('*').h()
.circuit()
.run()

Circuit(`a unit placing every qubit into superposition`, 3)
.unit().h()
.circuit()
.run()

function Circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
