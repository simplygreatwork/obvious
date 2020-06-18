
const logger = require('../src/logger')()
const math = require('mathjs')

// a brute force illustration of the intent behind Shor's algorithm 
// this finds the two prime numbers which are the prime factors of a semiprime product
// prime a * prime b = the semiprime product
// this will not scale well to very large sets of prime numbers

let primes = new Primes({ max: 1000 })
let host = new Host()
let oracle = new Oracle()
let a = host.test(oracle)
let b = oracle.sibling(a)
let semiprime = a * b
logger.log(`The host detected one prime factor of "${a}".`)
logger.log(`The oracle acknowledged the other prime factor of "${b}".`)
logger.log(`${a} * ${b} = ${semiprime}.`)
logger.log(`Does the oracle confirm the semiprime? ${oracle.confirm(semiprime)}`)
logger.log('')

function Host() {
	
	Object.assign(this, {
		
		test: function(oracle) {
			
			let result = null
			primes.iterate(function(prime) {
				if (oracle.query(prime) === 0) {
					result = prime
					return 'break'
				}
			}.bind(this))
			return result
		}
	})
}

function Oracle() {
	
	Object.assign(this, {
		
		initialize: function() {
			
			this.factors = []
			this.factors.push(primes.random())
			this.factors.push(primes.random())
			this.semiprime = this.factors[0] * this.factors[1]
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

function Primes(options) {
	
	Object.assign(this, {
		
		initialize: function() {
			
			this.primes = []
			let max = options && options.max ? options.max : 100
			repeat(max, function(index) {
				if (math.isPrime(index)) {
					this.primes.push(index)
				}
			}.bind(this))
		},
		
		random: function() {
			return this.primes[Math.floor(Math.random() * this.primes.length)]
		},
		
		iterate: function(fn) {
			
			repeat(this.primes.length, function(index) {
				let prime = this.primes[index]
				return fn(prime)
			}.bind(this))
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
