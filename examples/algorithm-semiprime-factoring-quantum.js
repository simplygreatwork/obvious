
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a quantum implementation of Simon's algorithm
// https://www.scottaaronson.com/blog/?p=208
// a work in progress - just a skeleton for now

repeat(5, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = new Oracle({ length: 4 })
	let result = host.test(oracle)
	logger.log('')
	logger.log(`The host has detected a result of ${result}`)
	logger.log(`Does the oracle confirm? ${oracle.confirm(result)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			return null
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
			return
		},
		
		confirm: function(value) {
			return 'no'
		}
	})
	
	this.initialize()
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
