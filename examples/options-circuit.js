
const logger = require('../src/logger')()

// illustrations of circuit configuration options - none are actually yet implemented

let circuit = require('../src/circuit.js')

circuit('circuit gates added with controls before targets', 3, {
	order: ['controls', 'targets'],
	logger: logger
}).run()

circuit('circuit gates added with targets before controls (default)', 3, {
	order: ['targets', 'controls'],
	logger: logger
}).run()

circuit('circuit states with big endian state vector bits - lowest bit on left side', 3, {
	endian: 'big',
	logger: logger
}).run()

circuit('circuit states with little endian state vector bits - lowest bit on rights side (default)', 3, {
	endian: 'little',
	logger: logger
}).run()

circuit('circuit with custom state vector bit characters - "0" and "1"', 3, {
	bit_characters: ['0', '1'],
	logger: logger
}).run()

circuit('circuit with custom state vector bit characters - "x" and " "', 3, {
	bit_characters: ['x', ' '],
	logger: logger
}).run()

circuit('circuit with custom simulator backend', 3, {
	engine: 'optimized',
	logger: logger
}).run()
