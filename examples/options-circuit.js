
const logger = require('../src/logger')()

// illustrations of circuit configuration options - none are actually yet implemented

let circuit = require('../src/circuit.js')

circuit({
	name: 'circuit gates added with controls before targets',
	size: 3,
	logger: logger,
	order: ['controls', 'targets'],
}).run()

circuit({
	name: 'circuit gates added with targets before controls (default)',
	size: 3,
	logger: logger,
	order: ['targets', 'controls'],
}).run()

circuit({
	name: 'circuit states with big endian state vector bits - lowest bit on left side',
	size: 3,
	logger: logger,
	endian: 'big',
}).run()

circuit({
	name: 'circuit states with little endian state vector bits - lowest bit on rights side (default)',
	size: 3,
	logger: logger,
	endian: 'little',
}).run()

circuit({
	name: 'circuit with custom state vector bit characters - "0" and "1"',
	size: 3,
	logger: logger,
	bit_characters: ['0', '1'],
}).run()

circuit({
	name: 'circuit with custom state vector bit characters - "x" and " "',
	size: 3,
	logger: logger,
	bit_characters: ['x', ' '],
}).run()

circuit({
	name: 'circuit with custom simulator backend',
	size: 3,
	logger: logger,
	engine: 'optimized',
}).run()
