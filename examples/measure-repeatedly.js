
const logger = require('../src/logger')()

// internal circuit probabilities can never really be inspected
// so run a circuit multiple times to discover the probability of each possible outcome

let tally = {} 
repeat(100, function() {
	let result = run()
	tally[result] = tally[result] || 0
	tally[result]++ 
})
logger.log(`The repeatedly measured random probability of heads or tails is ${JSON.stringify(tally)}`)

function run() {
	
	let circuit = Circuit('flip a coin', 1)
	.h(0)
	.run()
	return circuit.measure()
}

function Circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
