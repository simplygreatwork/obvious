
let result = {}

circuit('adder-input', 10)
.set_value(a, 3)
.set_value(b, 12)
.run('trace')
.each(function(each) {
	result.a = parseInt(each.bits.substring(5, 9).split('').join(''), 2)
	result.b = parseInt(each.bits.substring(1, 5).split('').join(''), 2)
	console.log()
	console.log(`${result.a} + ${result.b} = ?`)
	console.log()
})

circuit('adder-output', 10)
.set_value(a, 3)
.set_value(b, 12)
.add(a, b, cin, cout)
.run('trace')
.each(function(each) {
	result.c = parseInt(each.bits.substring(1, 5).split('').join(''), 2)
	console.log()
	console.log(`${result.a} + ${result.b} = ${result.c}`)
	console.log()
})

function circuit(name, size) {
	
	let circuit = require('../src/circuit.js')(name, size)
	Object.assign(circuit, {
		set_value: function(variable, value) {
			value.toString(2).split('').reverse().forEach(function(bit, index) {
				if (bit == '1') circuit.x(variable(index))
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
			.cx(cout(0), a(3))
			.unmajority(a(2), b(3), a(3))
			.unmajority(a(1), b(2), a(2))
			.unmajority(a(0), b(1), a(1))
			.unmajority(cin(0), b(0), a(0))
		},
		majority: function(a, b, c) {
			return this
			.cx(c, b)
			.cx(c, a)
			.ccx(a, b, c)
		},
		unmajority: function(a, b, c) {
			return this
			.ccx(a, b, c)
			.cx(c, a)
			.cx(a, b)
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
