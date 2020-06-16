

const logger = require('../src/logger')()
const Bits = require('../src/bits')

repeat(5, function() {
	run()
})

function run() {
	
	let host = new Host()
	let oracle = Oracle().random({ length: 4 })
	let result = host.test(oracle)
	console.log(`The host detected an oracle value of ${result}. [${host.bits}]`)
	console.log(`Does the oracle confirm this? ${oracle.confirm(result)}`)
	console.log('')
}

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			this.bits = []
			repeat(oracle.length, function(index) {
				let bit = oracle.query(index)
				this.bits.push(bit)
			}.bind(this))
			return Bits.fromArray(this.bits).toNumber()
		}
	})
}

function Oracle() {
	
	return {
		
		random: function(options) {
			
			options = options || {}
			options.length = options.length || 4
			let random = Math.floor(Math.random() * Math.pow(2, options.length))
			let bits = Bits.fromNumber(random, options.length)
			
			let oracle = {
				query: function(index) {
					return this.bits.toArray()[index]
				},
				confirm: function(value) {
					return this.bits.toNumber() === value ? 'yes' : 'no'
				}
			}
			
			return Object.assign(oracle, {
				length: options.length,
				bits: bits
			})
		}
	}
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}

function Oracle_(string) {
	
	const number = parseInt(string, 2)
	return function (value) {
		let product = value & number
		console.log('product: ' + product)
		let result = 0
		while (product > 0) {
			if (product % 2 === 1) result++
			product >>= 1
		}
		return result
	}
}

const f = createHiddenStringFunction('01101');
console.log(`Hidden string is: ${bernsteinVazirani(f, 5)}`);
