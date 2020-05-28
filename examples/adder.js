
const utility = require('../src/utility')

let result = {}

circuit('adder-input', 10)
.set_value(a, 3)
.set_value(b, 12)
.run('trace')
.each(function(each) {
	result.a = utility.bits_to_number(utility.number_to_bits(each.index, this.size).splice(5, 4))
	result.b = utility.bits_to_number(utility.number_to_bits(each.index, this.size).splice(1, 4))
	console.log(`\n${result.a} + ${result.b} = ?\n`)
})

circuit('adder-output', 10)
.set_value(a, 3)
.set_value(b, 12)
.add(a, b, cin, cout)
.run('trace')
.each(function(each) {
	result.c = utility.bits_to_number(utility.number_to_bits(each.index, this.size).splice(1, 4))
	console.log(`\n${result.a} + ${result.b} = ${result.c}\n`)
})

function circuit(name, size) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		set_value: function(variable, value) {
			utility.number_to_bits(value).reverse().forEach(function(bit, index) {
				if (bit) circuit.x(variable(index))
			})
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
	return circuit
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
