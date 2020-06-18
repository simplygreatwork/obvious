
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a classical illustration of Simon's algorithm
// todo: investigate how to property handle case of all secret bits off (0000): e.g. when no pairs exist
// todo: review whether the algorithm permits a secret of 0000

repeat(20, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = new Oracle({ length: 14 })
	let result = host.test(oracle)
	logger.log('')
	logger.log(`The host detected an oracle value of "${result}".`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			let answer = null
			this.results = {}
			repeat(Math.pow(2, oracle.length), function(index) {
				let bitstring = Bits.fromNumber(index, oracle.length).toString()
				let result = oracle.query(bitstring)
				if (this.results[result] !== undefined) {
					let a = Bits.fromString(bitstring)
					let b = Bits.fromString(this.results[result])
					answer = a.xor(b).toString()
					return 'break'
				} else {
					this.results[result] = bitstring
				}
			}.bind(this))
			answer = answer || Bits.fromNumber(0, oracle.length).toString()		// review
			return answer
		}
	})
}

function Oracle(options) {
	
	Object.assign(this, {
		
		initialize: function() {
			
			this.length = options && options.length ? options.length : 4
			let random = Math.floor(Math.random() * Math.pow(2, this.length))
			this.secret = Bits.fromNumber(random, this.length).toString()
			this.table = {}
			let link = 0
			repeat(Math.pow(2, this.length), function(index) {
				let a = Bits.fromNumber(index, this.length).toString()
				let b = this.secret
				let xor = Bits.fromString(a).xor(Bits.fromString(b)).toString()
				if (this.table[a] === undefined) {
					link++
					this.table[a] = link
					this.table[xor] = link
				}
			}.bind(this))
		},
		
		query: function(value) {
			return this.table[value]
		},
		
		confirm: function(value) {
			return this.secret === value ? 'yes' : 'no'
		}
	})
	
	this.initialize()
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
