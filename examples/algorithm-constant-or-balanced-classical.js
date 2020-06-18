
const logger = require('../src/logger')()

// a classical illustration for the Deutsch-Jozsa algorithm

// suppose that an oracle contains a fixed list of values either 0 or 1
// if every element of the oracle returns 0, the oracle is constant
// if every element of the oracle returns 1, the oracle is constant
// if half of the elements return 0 and half return 1, the oracle is balanced
// otherwise, the oracle is unbalanced
// to detect whether constant or balanced, a 10-bit oracle would need to be queried a total of 1024 times (2^10)
// but the quantum version can perform this task with a single run using superposition for any number of bits
// todo: the classical and quantum versions of this algorithm need to be runnable as 2^n
// todo: illustate the actual manual value test and result for each index

repeat(10, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = new Oracle({ length : 3 })
	let kind = host.test(oracle)
	logger.log('')
	logger.log(`A ${kind} oracle was detected. [${host.tally}]`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(kind)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			this.tally = [0, 0]
			repeat(oracle.size, function(index) {
				let result = oracle.query(index)
				this.tally[result] = this.tally[result] + 1
			}.bind(this))
			if (this.tally[0] === 0 || this.tally[1] === 0) {
				return 'constant'
			} else if (this.tally[0] === this.tally[1]) {
				return 'balanced'
			} else {
				return 'non-balanced'
			}
		}
	})
}

function Oracle(options) {
	
	let length = options && options.length ? options.length : 4
	let oracles = [{
		query: function(value) { return 0 },
		confirm: function(kind) { return kind == 'constant' ? 'yes' : 'no' }
	}, {
		query: function(value) {	return 1 },
		confirm: function(kind) { return kind == 'constant' ? 'yes' : 'no' }
	}, {
		query: function(value) { return value % 2 },
		confirm: function(kind) { return kind == 'balanced' ? 'yes' : 'no' }
	}, {
		query: function(value) { return [0, 0, 1][value % 3]},			// potential issue: a single bit would always be constant or balanced
		confirm: function(kind) { return kind == 'non-balanced' ? 'yes' : 'no' }
	}]
	Object.assign(this, { size: Math.pow(2, length) })
	Object.assign(this, oracles[Math.floor(Math.random() * 4)])
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
