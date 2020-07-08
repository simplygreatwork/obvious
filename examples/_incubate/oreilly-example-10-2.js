
const logger = require('../../src/logger')()
const Bits = require('../../src/bits')
const Sequence = require('../../src/sequence')

// todo: implement sequence with unit awareness

run()

function run(value) {
	
	let circuit = Circuit(`octopus example 10-2`, 4)
	.h(0).h(1)
	.compute()
	.satisfy()
	.uncompute()
	.amplify()
	.run('trace')
	
	let result = circuit.measure().toNumber()
	let box_a = result & 1 ? 'kitten' : 'tiger'
	let box_b = result & 2 ? 'kitten' : 'tiger'
	logger.log(`Box 'A' contains a ${box_a}.`)
	logger.log(`Box 'B' contains a ${box_b}.`)
	logger.log()
}

function Circuit(name, size, options) {
	
	let circuit = require('../../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		compute: function() {
			
			this.a_or_b().apply(this)
			this.not_a().apply(this)
			return this
		},
		
		uncompute: function() {
			
			this.not_a().reverse().apply(this)
			this.a_or_b().reverse().apply(this)
			return this
		},
		
		a_or_b: function() {
			
			return new Sequence()
			.x(0).x(1)
				.ccx(2, [0, 1])
			.x(0).x(1)
			.x(2)
		},
		
		not_a: function() {
			
			return new Sequence()
			.x(0)
		},
		
		satisfy: function() {
			return this.exclusive_not_or()
		},
		
		exclusive_not_or: function() {
			
			this.unit(3, 1)
			.x()
				.h()
					.cx(2)
					.cx(0)
					.x()
				.h()
			.x()
			return this
		},
		
		amplify: function(boxes) {
			
			return this
			.h(0).h(1)
			.x(0).x(1)
			.cz(0, 1)
			.x(0).x(1)
			.h(0).h(1)
		}
	})
}

function box(index) {
	return index
}

function note_a() {
	return 2
}

function ancillary() {
	return 3
}
