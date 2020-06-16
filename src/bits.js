
module.exports = class Bits {
	
	constructor(array) {
		
		this.array = array
		this.endian = 'little'
		this.endian = 'big'
	}
	
	flip(index) {
		
		this.array[index] = ! this.array[index]
		return this
	}
	
	toNumber() {
		
		return this.array.reduce(function(sum, value) {
			return sum << 1 | value
		})
	}
	
	toString(pattern) {
		
		pattern = pattern || '01'
		let result = []
		let off = pattern.charAt(0)
		let on = pattern.charAt(1)
		return this.array.map(function(each) {
			if (each) return on
			else return off
		}).join('')
	}
	
	toArray() {
		return this.array
	}
	
	static fromNumber(number, length) {
		
		let string = number.toString(2)
		if (length) string = string.padStart(length, '0') 
		return new Bits(string.split('').map(function(each) {
			return each === '1'
		}))
	}
	
	static fromString(string, pattern) {
		
		pattern = pattern || '01'
		string = string
		.split(pattern.charAt(0)).join('0')
		.split(pattern.charAt(1)).join('1')
		return new Bits(string.split('').map(function(each) {
			return each === '1'
		}))
	}
	
	static fromArray(array) {
		
		return new Bits(array)
	}
}
