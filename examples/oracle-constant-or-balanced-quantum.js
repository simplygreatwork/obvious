

const logger = require('../src/logger')()

// the quantum implementation of the Deutsch-Jozsa algorithm
// important: need to explain how the classical solution corresponds to the Deutsch-Jozsa algorithm
// todo: the classical and quantum versions of this algorithm need to be runnable as 2^n

run()
run()
run()
run()
run()

function run() {
	
	let circuit = Circuit('a constant or a balanced oracle', 3)
	circuit.unit('*').h()
	let oracle = Oracle()
	oracle.apply(circuit)
	circuit.unit('*').h()
	circuit.run()
	let kind = circuit.kind()
	console.log(`The kind of oracle detected was "${kind}".`)
	console.log(`Was the kind of oracle detected correctly? : ${oracle.confirm(kind)}`)
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
		
		kind: function() {
			
			let bits = this.measure()
			console.log(`The measured state of this circuit is |${bits.toString(' x')}> (${bits.toNumber()})`)
			return bits.toNumber() === 0 ? 'constant' : 'balanced'
		}
	})
	
	return circuit
}

function Oracle() {
	
	return Math.random() < 0.5 ? {
		apply: function(circuit) {
			return
		},
		confirm: function(kind) {
			return kind == 'constant'
		}
	} : {
		apply: function(circuit) {
			return circuit
			.h(2)
			.z(0).cx(2, 1)
			.h(2)
		},
		confirm: function(kind) {
			return kind == 'balanced'
		}
	}
}
