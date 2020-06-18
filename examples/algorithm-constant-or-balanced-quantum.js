
const logger = require('../src/logger')()

// the quantum implementation of the Deutsch-Jozsa algorithm
// important: need to explain how the classical solution corresponds to the Deutsch-Jozsa algorithm
// todo: the classical and quantum versions of this algorithm need to be runnable as 2^n

repeat(10, function() {
	run()
})

function run() {
	
	let circuit = Circuit('a randomly installed oracle which is either constant or balanced', 3)
	circuit.unit('*').h()
	let oracle = new Oracle()
	oracle.apply(circuit)
	circuit.unit('*').h()
	circuit.run()
	let kind = circuit.kind()
	logger.log('')
	logger.log(`A ${kind} oracle was detected.`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(kind)}`)
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
		
		kind: function() {
			
			let bits = this.measure()
			logger.log(`The measured state of this circuit is |${bits.toString(' x')}> as index |${bits.toNumber()}>`)
			return bits.toNumber() === 0 ? 'constant' : 'balanced'
		}
	})
	
	return circuit
}

function Oracle(options) {
	
	let oracles = [{
		apply: function(circuit) {
			return
		},
		confirm: function(kind) {
			return kind == 'constant' ? 'yes' : 'no'
		}
	}, {
		apply: function(circuit) {
			return circuit
			.h(2)
			.z(0).cx(2, 1)
			.h(2)
		},
		confirm: function(kind) {
			return kind == 'balanced' ? 'yes' : 'no'
		}
	}]
	
	Object.assign(this, oracles[Math.floor(Math.random() * 2)])
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
