

const logger = require('../src/logger')()
const Bits = require('../src/bits')

run()

function run() {
	
	let host = new Host()
	let oracle = Oracle().random({ bits: 4 })
	let result = host.test(oracle)
	console.log(`The host detected an oracle value of ${result}. [${box.bits}]`)
	console.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
	console.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			this.bits = []
			repeat(size, function(index) {
				let bit = oracle.query(index)
				this.bits.push(bit)
			})
			return Bits.fromArray(this.bits).toNumber()
		}
	})
}

function Oracle() {
	
	return {
		
		random: function(options) {
			
			options = options || {}
			options.size = options.size || 4
			let random = Math.floor(Math.random() * Math.pow(2, size))
			this.bits = Bits.fromNumber(random, size)
			return {
				query: function(index) {
					return this.bits.toArray()[index]
				}.bind(this),
				confirm: function(value) {
					return this.bits.toNumber() === value
				}.bind(this)
			}
		}
	}
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
