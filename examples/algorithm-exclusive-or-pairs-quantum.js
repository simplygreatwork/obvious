
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a quantum implementation of Simon's algorithm

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
			
			let result = null
			let length = oracle.length
			repeat(Infinity, function(index) {
				let circuit = Circuit(`a quantum circuit to discover an oracle's secret bitstring using xor`, length * 2)
				let unit = circuit.unit(0, length)
				unit.h()
				oracle.apply(circuit)
				unit.h()
				circuit.run()
				let bits = unit.measure()
				if (bits.toNumber() !== 0) {
					result = bits.toString()
					return 'break'
				}
			})
			return result
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
			let random = Math.floor(Math.random() * (Math.pow(2, this.length) - 1)) + 1	// the secret cannot be zero
			this.secret = Bits.fromNumber(random, this.length).toString()
		},
		
		apply: function(circuit) {
			
			Bits.fromString(this.secret).iterate(function(bit, index) {
				if (bit) {
					repeat(this.length, function(index_) {
						circuit.cx(this.length + index_, index)
					}.bind(this))
				}
			}.bind(this))
		},
		
		confirm: function(value) {
			return this.secret === value ? 'yes' : 'no'
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