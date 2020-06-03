
// let integer = 13195
// let integer = 8633
// let integer = 991 * 997
// let integer = 99989 * 99991
// let integer = 9999973 * 9999991
// let integer = 100000004953 * 100000004987

let primeArray = []

class Test {
	
	constructor() {
		
		let array = this.factor(99989 * 99991)
		console.log('array: ' + array)
		let result = this.power_mod(3, 7, 5)
		console.log('result: ' + result)
	}
	
	factor(integer) {
		
		let array = []
		let prime
		for (let i = 2; i <= integer; i++) {
			if (integer % i == 0) {
				for (var j = 2; j <= i / 2; j++) {
					if (i % j == 0) {
						prime = false
					} else {
						prime = true
					}
				}
				if (prime == true) {
					integer /= i
					array.push(i)
				}
			}
		}
		return array
	}
	
	power_mod(x, y, m) {
		
		if (y === 0) return 1
		if (y === 1) return x
		const y_half = Math.floor(y / 2)
		const y_half_power = this.power_mod(x, y_half, m)
		let result = (y_half_power * y_half_power) % m
		if (y % 2 === 1) result = (x * result) % m
		return result
	}
	
	find_period() {
		
		
	}
}

new Test()