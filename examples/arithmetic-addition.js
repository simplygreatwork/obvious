
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// this example does not use quantum superposition so it's basically classical addition

add({ a: 3, b: 12})

function add(options) {
	
	let values = {}
	input(options, values)
	output(options, values)
}

function input(options, values) {
	
	let circuit = Circuit(`illustrating the inputs: a and b`, 10)
	.set_value(a, options.a)
	.set_value(b, options.b)
	.run('trace')
	values.a = circuit.unit(1, 4).measure().toNumber()
	values.b = circuit.unit(5, 4).measure().toNumber()
	logger.log(`\n${values.a} + ${values.b} = ?\n`)
}

function output(options, values) {
	
	let circuit = Circuit('adding a + b into b', 10)
	.set_value(a, options.a)
	.set_value(b, options.b)
	.add(a, b, cin, cout)
	.run('trace')
	values.result = circuit.unit(5, 4).measure().toNumber()
	logger.log(`\n${values.a} + ${values.b} = ${values.result}\n`)
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
		
		set_value: function(variable, value) {
			
			Bits.fromNumber(value, this.size).toArray().reverse().forEach(function(bit, index) {
				if (bit) this.x(variable(index))
			}.bind(this))
			return this
		},
		
		get_value: function(variable, value) {
			return this
		},
		
		add: function(a, b, cin, cout) {
			
			return this
			.majority(cin(0), b(0), a(0))
			.majority(a(0), b(1), a(1))
			.majority(a(1), b(2), a(2))
			.majority(a(2), b(3), a(3))
			.cx(a(3), cout(0))
			.unmajority(a(2), b(3), a(3))
			.unmajority(a(1), b(2), a(2))
			.unmajority(a(0), b(1), a(1))
			.unmajority(cin(0), b(0), a(0))
		},
		
		majority: function(a, b, c) {
			
			return this
			.cx(b, c)
			.cx(a, c)
			.ccx(c, [a, b])
		},
		
		unmajority: function(a, b, c) {
			
			return this
			.ccx(c, [a, b])
			.cx(a, c)
			.cx(b, a)
		}
	})
}

function cin() {
	return 0
}

function a(index) {
	return 1 + index
}

function b(index) {
	return 5 + index
}

function cout() {
	return 9
}
