
const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a classical background for Simon's algorithm
// a work in progress

illustrate()

function illustrate() {
	
	xor('101', '010')
	xor('010', '101')
	xor('010', '010')
	xor('101', '101')
	xor('000', '111')
	xor('111', '000')
	xor('000', '000')
	xor('111', '111')
}

function xor(a, b) {
	
	let result = Bits.fromString(a).xor(Bits.fromString(b))
	logger.log(`The exclusive OR of ${a} and ${b} is "${result}".`)
}

repeat(1, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = new Oracle({ length: 3 })
	let result = host.test(oracle)
	logger.log(`The host detected an oracle value of "${result}".`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			let result = 'n/a'
			this.results = {}
			repeat(Math.pow(2, oracle.length), function(index) {
				let bits = Bits.fromNumber(index, oracle.length).toString()
				let result = oracle.query(bits)
				if (this.results[result] !== undefined) this.candidates(this.results[result], bits)
				this.results[result] = bits
				logger.log(`Querying the oracle with bits ${bits} returns ${result}.`)
			}.bind(this))
			return result
		},
		
		candidate: function() {
			return
		}
	})
}

function Oracle(options) {
	
	this.length = options && options.length ? options.length : 4
	let random = Math.floor(Math.random() * Math.pow(2, this.length))
	this.secret = Bits.fromNumber(random, this.length).toString()
	
	Object.assign(this, {
		
		query: function(value) {
			return value
		},
		
		confirm: function(value) {
			return this.bitstring === value ? 'yes' : 'no'
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
