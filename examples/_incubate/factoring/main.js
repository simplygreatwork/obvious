
let math = require('mathjs')
let utility = require('../../src/utility')

class Application {
	
	constructor() {
		
		this.classical()
		this.quantum()
		console.log('greatest_common_denominator: ' + this.greatest_common_denominator(8, 12))
		console.log('least_common_multiple: ' + this.least_common_multiple(4, 6))
	}
	
	primes() {
		
		let primes = []
		for (let i = 0; i < 10000000; i++) {
			if (math.isPrime(i)) primes.push(i)
		}
		return primes
	}
	
	factor(number) {
		
		let primes = this.primes()
		console.log('highest two: ' + primes.pop() + ' ' + primes.pop())
	}
	
	classical() {
		return
	}
	
	quantum() {
		return
	}
	
	greatest_common_denominator() {
		return math.gcd(...arguments)
	}
	
	least_common_multiple() {
		return math.lcm(...arguments)
	}
}

let application = new Application()
application.factor(25)
