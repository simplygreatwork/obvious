
const logger = require('../src/logger')()
const Bits = require('../src/bits')

add()

function add(options) {
	
	input()
	output()
}

function input(options) {
	
	let circuit = Circuit(`illustrating the inputs: a and b`, 8)
	.initialize()
	let shots = 100, tally = {}
	repeat(shots, function() {
		circuit.run()
		let a = circuit.unit(0, 4).measure().toNumber()
		let b = circuit.unit(4, 2).measure().toNumber()
		let key = a + ' + ' + b
		tally[key] = tally[key] || 0
		tally[key]++
	})
	logger.log(`The inputs in superposition are any of: \n`)
	Object.keys(tally).forEach(function(each) {
		logger.log(`    ${each} = ?`)
	})
}

function output(options) {
	
	let circuit = Circuit(`adding a + b into a`, 8)
	.initialize()
	.addition()
	let shots = 100, tally = {}
	repeat(shots, function() {
		circuit.run()
		let a = circuit.unit(0, 4).measure().toNumber()
		tally[a] = tally[a] || 0
		tally[a]++
	})
	logger.log(`The outputs in superposition are any of ${JSON.stringify(Object.keys(tally))}\n`)
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
			.x(a(0))
			.h(a(2))
			.u1(a(2), [], { lambda: 'pi / 4'})
			.x(b(0))
			.h(b(1))
			.u1(b(1), [], { lambda: 'pi / 2'})
		},
		
		addition: function() {
			
			return this
			.ccx(scratch(0), [b(0), a(0)])
			.ccx(scratch(1), [a(1), a(2)])
			.ccx(a(3), [scratch(0), scratch(1)])
			.ccx(scratch(1), [a(1), a(2)])
			.ccx(scratch(0), [b(0), a(0)])
			.ccx(scratch(0), [b(0), a(0)])
			.ccx(a(2), [scratch(0), a(1)])
			.ccx(scratch(0), [b(0), a(0)])
			.ccx(a(1), [b(0), a(0)])
			.cx(a(0), b(0))
			.ccx(scratch(0), [b(1), a(1)])
			.ccx(a(3), [scratch(0), a(2)])
			.ccx(scratch(0), [b(1), a(1)])
			.ccx(a(2), [b(1), a(1)])
			.cx(a(1), b(1))
		}
	})
}

function a(index) {
	return 0 + index
}

function b(index) {
	return 4 + index
}

function scratch(index) {
	return 6 + index
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
