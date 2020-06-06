
const gates = require('./derived/quantastica/gates')

module.exports = {
	
	arrayify: function(value) {
		
		if (value === null) return []
		if (value === undefined) return []
		if (! Array.isArray(value)) return [value]
		return value
	},
	
	install_gates: function(object, circuit) {
		
		let chain = this
		Object.keys(gates).forEach(function(key) {
			object[key.toLowerCase()] = function(targets, controls, options) {
				let name = this
				circuit.addGate(name, targets, controls, options)
				return object
			}.bind(key)
		}.bind(this))
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
