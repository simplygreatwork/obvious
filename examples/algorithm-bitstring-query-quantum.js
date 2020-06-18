
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// the quantum version of the Bernstein-Vazirani algorithm
// todo: need to be able to measure only part of the circuit register

repeat(10, function() {
	run()
})

function run() {
	
	let length = 4
	let circuit = Circuit('a random oracle for a bitwise probing', length)
	let oracle = new Oracle({ length: length - 1 })
	let all = circuit.unit('*')
	let main = circuit.unit(0, length - 1)
	let scratch = circuit.unit(length - 1)
	all.h()
	scratch.z()
	oracle.query(circuit)
	main.h()
	circuit.run()
	let result = circuit.evaluate(main)
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
		
		evaluate: function(main) {
			
			if (true) {
				return main.measure()
			} else {
				let bits = this.measure()
				let array = bits.toArray()
				array.shift()
				bits = Bits.fromArray(array)
				return bits
			}
		}
	})
	
	return circuit
}

function Oracle(options) {
	
	this.length = options && options.length ? options.length : 4
	let random = Math.floor(Math.random() * Math.pow(2, this.length))
	this.bitstring = Bits.fromNumber(random, this.length).toString()
	
	Object.assign(this, {
		
		query: function(circuit) {
			
			let scratch = circuit.unit(3)
			Bits.fromString(this.bitstring).iterate(function(each, index) {
				if (each) scratch.cx(index)
			})
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
