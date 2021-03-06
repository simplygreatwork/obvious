
const logger = require('../src/logger')()
const Bits = require('../src/bits')
const Sequence = require('../src/sequence')

increment()
decrement()

function increment() {
	
	input()
	output()
	
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
		
		let circuit = Circuit(`the outputs in superposition after incrementing`, 5)
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
}

function decrement() {
	
	input()
	output()
	
	function input() {
		
		let circuit = Circuit(`the inputs in superposition before decrementing`, 5)
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
		
		let circuit = Circuit(`the outputs in superposition after decrementing`, 5)
		.initialize()
		.decrement()
		let shots = 100, tally = {}
		repeat(shots, function() {
			let result = circuit.run().measure().toNumber()
			tally[result] = tally[result] || 0
			tally[result]++ 
		})
		logger.log(`\nThe decremented outputs are ${JSON.stringify(Object.keys(tally))}\n`)
	}
}

function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		initialize: function() {
			
			return this
			.x(1)
			.h(2)
			.t(2)
		},
		
		increment: function() {
			return this.sequence().apply(circuit)
		},
		
		decrement: function() {
			return this.sequence().reverse().apply(circuit)
		},
		
		sequence: function() {
			
			return new Sequence()
			.ccx(4, [0, 1])
			.ccx(3, [4, 2])
			.ccx(4, [0, 1])
			.ccx(3, [0, 1])
			.cx(1, [0])
			.x(0)
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
