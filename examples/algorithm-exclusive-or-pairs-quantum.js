
const logger = require('../src/logger')()

// a quantum implementation of Simon's algorithm
// a work in progress - just a skeleton right now

repeat(1, function() {
	run()
})

function run() {
	
	let circuit = Circuit('a quantum circuit to find a secret bitstring using xor', 3)
	circuit.unit('*').h()
	let oracle = new Oracle()
	oracle.apply(circuit)
	circuit.unit('*').h()
	circuit.run()
	logger.log('')
	logger.log(`Does the oracle confirm? ${oracle.confirm()}`)
	logger.log('')
}

function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return circuit
}

function Oracle() {
	
	Object.assign(this, {
		
		apply: function(circuit) {
			return
		},
		
		confirm: function(value) {
			return 'no'
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
