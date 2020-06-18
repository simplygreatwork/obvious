
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a quantum implementation of Simon's algorithm
// a work in progress - just am unfinished skeleton right now targeting a 2-bit bitstring
// thought: likely need to run the circuit once per number of qubits to get the answer

repeat(1, function() {
	run()
})

function run() {
	
	let oracle = new Oracle({ length: 2 })
	let host = new Host()
	let result = host.test(oracle)
	logger.log('')
	logger.log(`Does the oracle confirm? ${oracle.confirm(result)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			let length = oracle.length
			repeat(length, function(index) {
				let circuit = Circuit(`a quantum circuit to discover an oracle's secret bitstring using xor`, length * 2)
				let unit = circuit.unit(0, length)
				unit.h()
				oracle.apply(circuit)
				unit.h()
				circuit.run('dense')
			})
		}
	})
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

function Oracle(options) {
	
	Object.assign(this, {
		
		initialize: function() {
			
			this.length = options && options.length ? options.length : 4
			let random = Math.floor(Math.random() * Math.pow(2, this.length - 1)) + 1		// the secret cannot be zero
			this.secret = Bits.fromNumber(random, this.length).toString()
		},
		
		apply: function(circuit) {
			
			return circuit
			.cx(2, 0)
			.cx(3, 0)
			.cx(2, 1)
			.cx(3, 1)
		},
		
		confirm: function(value) {
			return this.secret === value ? 'yes' : 'no'
		}
	})
	
	this.initialize()
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
