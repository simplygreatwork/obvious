
const logger = require('../src/logger')()
const Bits = require('../src/bits')

increment()

function increment() {
	
	input()
	output()
}

function input() {
	
	let circuit = Circuit(`the inputs in superposition before incrementing`, 5)
	.initialize()
	let shots = 100, tally = {}
	repeat(shots, function() {
		let result = circuit.run().measure().toNumber()
		tally[result] = tally[result] || 0
		tally[result]++ 
	})
	logger.log(`\nThe inputs are ${JSON.stringify(Object.keys(tally))}\n`)
}

function output() {
	
	let circuit = Circuit(`the output in superposition after incrementing`, 5)
	.initialize()
	.increment()
	let shots = 100, tally = {}
	repeat(shots, function() {
		let result = circuit.run().measure().toNumber()
		tally[result] = tally[result] || 0
		tally[result]++ 
	})
	logger.log(`\nThe incremented outputs are ${JSON.stringify(Object.keys(tally))}\n`)
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
		
		initialize: function() {
			
			return this
			.x(1)
			.h(2)
			.t(2)
		},
		
		increment: function() {
			
			return this
			.toffoli(4, [0, 1])
			.toffoli(3, [4, 2])
			.toffoli(4, [0, 1])
			.toffoli(3, [0, 1])
			.cx(1, [0])
			.x(0)
		},
		
		decrement: function() {
			
			return this
			.x(0)
			.cx(1, [0])
			.toffoli(3, [0, 1])
			.toffoli(4, [0, 1])
			.toffoli(3, [4, 2])
			.toffoli(4, [0, 1])
		},
		
		toffoli: function(target, controls) {
			
			return this
			.h(target)
			.cx(target, controls[1]).tdg(target).cx(target, controls[0]).t(target)
			.cx(target, controls[1]).tdg(target).cx(target, controls[0]).t(target)
			.h(target)
			.t(controls[1])
			.cx(controls[1], controls[0])
			.t(controls[0]).tdg(controls[1])
			.cx(controls[1], controls[0])
		}
	})
	
	return circuit
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
