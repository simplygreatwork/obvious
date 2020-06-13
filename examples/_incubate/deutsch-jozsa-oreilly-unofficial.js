
// https://oreilly-qc.github.io/?p=14-DJ

const logger = require('../../src/logger')()

run()
run()
run()
run()
run()

function run() {
	
	circuit = Circuit('oracle-random', 4)
	.unit(3).h().rz([], { phi: 'pi' }).circuit()
	.unit(0, 3).h().circuit()
	let oracle = Oracle()
	oracle.apply(circuit)
	circuit.run('trace')
	console.log('oracle kind: ' + oracle.kind)
	console.log('')
}

function Circuit(name, size) {
	
	return require('../../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}

function Oracle() {
	
	return Math.random() < 0.5 ? {
		kind: 'constant',
		apply: function(circuit) {
			circuit.unit(3).rz([], { phi : 'pi'})
		}
	} : {
		kind: 'balanced',
		apply: function(circuit) {
			circuit.unit(3).cz(circuit.unit(0, 3).index, 0)
		}
	}
}
