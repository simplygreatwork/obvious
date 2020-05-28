module.exports = {
	
	arrayify: function(value) {
		
		if (value === null) return []
		if (value === undefined) return []
		if (! Array.isArray(value)) return [value]
		return value
	},
	
	number_to_bits : function(value, length) {
		
		let array = value.toString(2).split('').map(function(each) {
			return each === '1'
		})
		if (length) {
			while (array.length < length) {
				array.unshift(false)
			}
		}
		return array
	},
	
	bits_to_number: function(array) {
		
		return array.reduce(function(sum, value) {
			return sum << 1 | value
		})
	}
}
