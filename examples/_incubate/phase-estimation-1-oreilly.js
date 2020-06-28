
const logger = require('../../src/logger')()

let m = 4, n = 1
let circuit = Circuit('estimating phase', m + n)
let output = circuit.output()
console.log('output.bits: ' + output.bits)
console.log('output.qft_inverse: ' + output.qft_inverse)
let input = circuit.input()
input.ry({ theta: -135 })
output.had()
for (var i = 0; i < output.length; i++) {
	let count = 1 << i
	// if (count & 1) input.ch(null, ~0, output.bits(count))
}
output.qft_inverse()
circuit.run()

function Circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		input: function(length) {
			
			let unit = this.unit(m, n)
			return Object.assign(unit, {
				
			})
		},
		
		output: function() {
			
			let unit = this.unit(0, m)
			return Object.assign(unit, {
				
				qft_inverse: function() {
					
					this.circuit().qft_inverse(index, length)
				},
				
				bits: function() {
					return					
				},
			})
		},
		
		qft_inverse: function(begin, length) {
			return
		}
	})
}
