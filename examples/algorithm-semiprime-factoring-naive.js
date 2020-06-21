
const logger = require('../src/logger')()
const math = require('mathjs')

// a naive brute force illustration of the concept behind Shor's algorithm 
// this illustration finds the two prime numbers which are the prime factors of a semiprime product
// prime a * prime b = the semiprime product
// this will not scale well to very large sets of prime numbers

let primes = new Primes({ max: 1000 })
let host = new Host()
let oracle = new Oracle()
let a = host.test(oracle)
let b = oracle.sibling(a)
let semiprime = a * b
logger.log('')
logger.log(`The host found one prime factor of ${a}.`)
logger.log(`The oracle acknowledged the other prime factor of ${b}.`)
logger.log(`The factor ${a} times the factor ${b} equals the semiprime product ${semiprime}.`)
logger.log(`${a} * ${b} = ${semiprime}.`)
logger.log(`Does the oracle confirm this semiprime? ${oracle.confirm(semiprime)}`)
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
			
			let factors = []
			factors.push(primes.random())
			factors.push(primes.random())
			this.semiprime = factors[0] * factors[1]
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
			
			this.array = []
			let max = options && options.max ? options.max : 100
			repeat(max, function(index) {
				if (math.isPrime(index)) {
					this.array.push(index)
				}
			}.bind(this))
		},
		
		random: function() {
			return this.array[Math.floor(Math.random() * this.array.length)]
		},
		
		iterate: function(fn) {
			
			repeat(this.array.length, function(index) {
				let prime = this.array[index]
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
