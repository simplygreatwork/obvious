
const logger = require('../src/logger')()

// the quantum version of the Bernstein-Vazirani algorithm
// not yet implemented

repeat(1, function() {
	run()
})

function run() {
	
	let circuit = Circuit('a random oracle for a bitwise query', 3)
	let oracle = Oracle().random()
	oracle.query(circuit)
	circuit.run()
}

function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		test: function() {
			return
		}
	})
	
	return circuit
}

function Oracle() {
	
	return {
		
		random: function(options) {
			
			return {
				query: function(circuit) {
					return
				},
				confirm: function(kind) {
					return true ? 'yes' : 'no'
				}
			}
		}
	}
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
