
// The Deutsch-Jozsa algorithm

// todo: need to actually measure the circuit to get a single result
// if the measured result is zero, infer that the oracle is constant
// if the measured result is non-zero, infer that the oracle is balanced
// and finally, confirm with the oracle itself whether your have correctly inferred the oracle kind by calling: oracle["kind?"]("balanced")

const logger = require('../src/logger')()

run()
run()
run()
run()
run()

function run() {
	
	circuit = Circuit('oracle-random', 4)
	circuit.unit('*').h()
	let oracle = Oracle()
	oracle.apply(circuit)
	circuit.unit('*').h()
	circuit.run()
	let kind = circuit.kind()
	console.log('detected oracle kind: ' + kind)
	console.log('correct?: ' + oracle["kind?"](kind))
	console.log('')
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
		
		kind: function() {				// todo: actually measure the circuit to get a single result
			
			let result = 'balanced'
			this.each(function(each, index) {
				if (index === 0 && each.magnitude === 1) result = 'constant'
			})
			return result
		}
	})
	
	return circuit
}

function Oracle() {
	
	return Math.random() < 0.5 ? {
		apply: function(circuit) {
			return
		},
		'kind?': function(kind) {
			return kind == 'constant'
		}
	} : {
		apply: function(circuit) {
			return circuit
			.h(2)
			.z(0).cx(2, 1)
			.h(2)
		},
		'kind?': function(kind) {
			return kind == 'balanced'
		}
	}
}
