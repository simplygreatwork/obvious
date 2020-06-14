
const logger = require('../src/logger')()

// a classical version of the basis of Deutsch-Jozsa algorithm
// a randomly chosen single bit classical oracle which returns either a constant result or balanced result for each input 0 or 1
// the oracle must be tested at least once per valid input (0 or 1) to determine whether the function is constant or balanced
// a 10-bit version of this classical oracle would need to test each value from 0 1023 (2^10) 
// the quantum version can perform this task with a single run using superposition for any number of bits
// todo: the classical and quantum versions of this algorithm need to be runnable as 2^n
// todo: so convert this example to demo multiple bits

run()
run()
run()
run()
run()

function run() {
	
	let oracle = Oracle().random()
	let box = new Box(oracle)
	box.test(0)
	box.test(1)
	let kind = box.kind()
	console.log(`The kind of oracle detected was "${kind}".`)
	console.log(`Was the kind of oracle detected correctly? : ${oracle.confirm(kind)}`)
	console.log('')
}

function Box(oracle) {
	
	this.oracle = oracle
	
	Object.assign(this, {
		
		test: function(input) {
			
			this.results = this.results || []
			this.results[input] = this.oracle.test(input)
		},
		
		is_constant: function() {
			return this.results[0] === this.results[1]
		},
		
		is_balanced: function() {
			return (this.results[0] === 0 && this.results[1] === 1) || (this.results[0] === 1 && this.results[1] === 0)
		},
		
		kind: function() {
			
			if (false) {
				return this.is_constant() ? 'constant' : 'balanced'
			} else {
				return this.is_balanced() ? 'balanced' : 'constant'
			}
		}
	})
}

function Oracle() {
	
	return {
		
		random: function() {
			
			let oracles = [{
				test: function(value) { return 0 },
				confirm: function(kind) { return kind == 'constant' }
			}, {
				test: function(value) {	return 1 },
				confirm: function(kind) { return kind == 'constant' }
			}, {
				test: function(value) { return value },
				confirm: function(kind) { return kind == 'balanced' }
			}, {
				test: function(value) { return 1 - value },
				confirm: function(kind) { return kind == 'balanced' }
			}]
			
			return oracles[Math.floor(Math.random() * 4)]
		}
	}
}
