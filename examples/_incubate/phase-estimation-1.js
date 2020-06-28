
const logger = require('../../src/logger')()

let m = 4, n = 1
let circuit = Circuit('estimating phase', m + n)
let output = circuit.output()
let input = circuit.input()
input.ry([], { theta: '-pi / 8' })
input.ry([], { theta: '-pi / 4' })
output.h()
for (var i = 0; i < output.length; i++) {
	let count = 1 << i
	if (count & 1) input.ch(null, ~0, output.bits(count))
}
output.qft_inverse()
circuit.run()

function Circuit(name, size) {
	
	let circuit = require('../../src/circuit.js')({
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
					this.circuit().qft_inverse(0, m)
				},
				
				bits: function(count) {
					return					
				},
			})
		},
		
		qft_inverse: function(begin, length) {
			
			begin = begin || 0
			length = length || this.size
			for (let i = begin, length_ = Math.floor((begin + length) / 2); i < length_; i++) {
				this.swap(i, length - (i + 1))
			}
			repeat(length, function(index) {
				this.h(index)
				for (let j = index + 1; j < length; j++) {
					this.cu1(j, index, { lambda: 'pi / ' + Math.pow(2, j - index) })
				}
			}.bind(this))
			return this
		}
	})
}
