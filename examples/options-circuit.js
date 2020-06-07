
let circuit = require('../src/circuit.js')

// illustrations of circuit configuration options - none are actually yet implemented

circuit('circuit gates added with controls before targets', 3, {
	order: ['controls', 'targets']
}).run()

circuit('circuit gates added with targets before controls (default)', 3, {
	order: ['targets', 'controls']
}).run()

circuit('circuit states with big endian state vector bits - lowest bit on left side', 3, {
	endian: 'big'
}).run()

circuit('circuit states with little endian state vector bits - lowest bit on rights side (default)', 3, {
	endian: 'little'
}).run()

circuit('circuit with custom state vector bit characters - "0" and "1"', 3, {
	bit_characters: ['0', '1']
}).run()

circuit('circuit with custom state vector bit characters - "x" and " "', 3, {
	bit_characters: ['x', ' ']
}).run()

circuit('circuit with custom simulator backend', 3, {
	engine: 'optimized'
}).run()
