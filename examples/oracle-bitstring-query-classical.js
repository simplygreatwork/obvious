

const logger = require('../src/logger')()
const Bits = require('../src/bits')

// a classical background for the Bernstein-Vazirani algorithm

repeat(5, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = new Oracle({ length: 5 })
	let result = host.test(oracle)
	logger.log(`The host detected an oracle value of "${result}".`)
	logger.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
	logger.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			this.bits = []
			repeat(oracle.length, function(index) {
				let bitmask = Bits.fromNumber(0, oracle.length).flip(oracle.length - 1 - index).toString()
				let result = oracle.query(bitmask)
				logger.log(`Querying the oracle with bitmask "${bitmask}" returns: ${result}.`)
				this.bits.unshift(result == 0 ? false : true)
			}.bind(this))
			return Bits.fromArray(this.bits).toString()
		}
	})
}

function Oracle(options) {
	
	let length = options && options.length ? options.length : 4
	let random = Math.floor(Math.random() * Math.pow(2, length))
	
	Object.assign(this, {
		
		length: length,
		bitstring: Bits.fromNumber(random, length).toString(),
		query: function(value) {
			let result = 0
			value = Bits.fromString(value).toNumber()
			let target = Bits.fromString(this.bitstring).toNumber()
			let product = value & target
			while (product > 0) {
				if (product % 2 === 1) result++
				product >>= 1
			}
			return result
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
