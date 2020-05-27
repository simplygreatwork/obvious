
const math = require('mathjs')

module.exports = format = {
	
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
