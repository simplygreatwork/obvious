
const logger = require('../../src/logger')()
const Bits = require('../src/bits')

circuit('estimating phase', 5)
.unit(0, 4).h().circuit()
.cu(4, 3)
.cu(4, 2)
.cu(4, 2)
.cu(4, 1)
.cu(4, 1)
.cu(4, 1)
.cu(4, 1)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.cu(4, 0)
.qft_inverse(0, 4)
// .qft(0, 4)
.run()

function circuit(name, size) {
	
	let circuit = require('../../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		cu: function(target, control) {
			return this.cu1fixed(target, control)
		},
		
		cu1fixed: function(target, control) {
			
			let value = 5
			return this
			.u1(target, [], { lambda: `-${value} * 2 * pi / 8` })
			.cx(target, control)
			.u1(target, [], { lambda: `${value} * pi / 8` })
			.cx(target, control)
		},
		
		qft: function(begin, length) {
			
			begin = begin || 0
			length = length || this.size
			repeat(length, function(index) {
				let inverse = (begin + length) - 1 - (index)
				this.h(inverse)
				for (let j = inverse - 1; j >= begin; j--) {
					this.cu1(inverse, j, { lambda: 'pi / ' + Math.pow(2, inverse - j) })
				}
			}.bind(this))
			for (let i = begin, length_ = Math.floor((begin + length) / 2); i < length_; i++) {
				this.swap(i, length - (i + 1))
			}
			return this
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

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		let result = fn.apply(this, [i])
		if (result === 'break') break
	}
}
