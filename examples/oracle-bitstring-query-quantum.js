
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// the quantum version of the Bernstein-Vazirani algorithm
// todo: need to be able to measure only part of the circuit register
// not complete: work in process

repeat(1, function() {
	run()
})

function run() {
	
	let circuit = Circuit('a random oracle for a bitwise query', 4)
	let oracle = new Oracle({ length: 3 })
	circuit.unit('*').h()
	circuit.unit(3).z()
	oracle.query(circuit)
	circuit.unit(0, 3).h()
	circuit.run()
	let result = circuit.evaluate()
	logger.log(`The host detected an oracle value of "${result}".`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
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
	
	Object.assign(circuit, {
		
		evaluate: function() {
			
			let bits = this.measure()				// todo: need to be able to measure only part of the circuit register
			let array = bits.toArray()
			array.reverse().pop()					// todo: review endian-ness in Bits.js
			bits = Bits.fromArray(array)
			return bits
		}
	})
	
	return circuit
}

function Oracle(options) {
	
	let length = options && options.length ? options.length : 4
	let random = Math.floor(Math.random() * Math.pow(2, length))
	
	Object.assign(this, {
		
		length: length,
		bitstring: Bits.fromNumber(random, length).toString(),
		
		query: function(circuit) {
			
			let array = Bits.fromString(this.bitstring).toArray()
			let scratch = circuit.unit(3)
			repeat(3, function(index) {
				if (array[index]) scratch.cx(index)
			}.bind(this))
		},
		
		confirm: function(value) {
			return this.bitstring == value ? 'yes' : 'no'
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
