
const math = require('mathjs')

module.exports = format = {
	
	label: function(index, size) {
		
		let result = index.toString(2)
		while (result.length < size) {
			result = '0' + result
		}
		if (true) {
			result = result.split('0').join(' ')
			result = result.split('1').join('x')
		}
		return result
	},
	
	complex: function(complex, options) {
		
		options = options || {}
		var real = format.float(complex.re, options)
		var options_ = JSON.parse(JSON.stringify(options))
		options_.plusChar = '+'
		var imaginary = format.float(complex.im, options_)
		return real + imaginary + (options.iotaChar ? options.iotaChar : "i")
	},
	
	float: function(value, options) {
		
		options = options || {}
		if (options.scale) value = math.round(value, options.scale)
		var string = value + ''
		if (options.fixedWidth) string = value.toFixed(options.scale)
		var plusChar = options.plusChar
		if (options.fixedWidth && ! plusChar) plusChar = ' '
		if (plusChar && value >= 0) string = plusChar + string
		return string
	},
	
	pad: function(string, length) {
		
		string.padStart(10, ' ')
	}
}
