
const logger = require('../src/logger')()
const math = require('mathjs')

// find the two prime numbers which are the primt factors of a semiprime product
// this is a brute force ullustration which will not scale well

let system = new System({ max: 1000 })
let host = new Host()
let oracle = new Oracle()
let a = host.test(oracle)
let b = oracle.sibling(a)
let semiprime = a * b
logger.log(`The host detected one prime factor of "${a}".`)
logger.log(`The oracle returned the other prime factor of "${b}".`)
logger.log(`${a} * ${b} = ${semiprime}.`)
logger.log(`Does the oracle confirm the semiprime? ${oracle.confirm(semiprime)}`)
logger.log('')

function Host(options) {
	
	Object.assign(this, options)
	Object.assign(this, {
		
		initialize: function() {
			return
		},
		
		test: function(oracle) {
			
			let result = null
			repeat(system.primes.length, function(index) {
				let prime = system.primes[index]
				if (oracle.query(prime) === 0) {
					result = prime
					return false
				}
			}.bind(this))
			return result
		}
	})
}

function Oracle(options) {
	
	Object.assign(this, options)
	Object.assign(this, {
		
		initialize: function() {
			
			let length = system.primes.length
			this.secrets = []
			this.secrets.push(system.primes[Math.floor(Math.random() * length)])
			this.secrets.push(system.primes[Math.floor(Math.random() * length)])
			this.semiprime = this.secrets[0] * this.secrets[1]
		},
		
		query: function(value) {
			return this.semiprime % value
		},
		
		sibling: function(prime) {
			return this.semiprime / prime
		},
		
		confirm: function(semiprime) {
			return semiprime === this.semiprime ? 'yes' : 'no'
		}
	})
	
	this.initialize()
}

function System(options) {
	
	this.primes = []
	let max = options && options.max ? options.max : 100
	repeat(max, function(index) {
		if (math.isPrime(index)) {
			this.primes.push(index)
		}
	}.bind(this))
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
