
const logger = require('../../src/logger')()
const Bits = require('../../src/bits')

// investigate: https://agentanakinai.wordpress.com/2019/09/22/quantum-phase-estimation/

let circuit = Circuit('estimating phase', 4)
circuit.x(3)
let unit = circuit.unit(0, 3)
circuit
.h(0)
.h(1)
.h(2)
circuit.render()
// circuit.qft_inverse(0, 3)
circuit.qft_dagger(0, 3)
circuit.run('trace')

let bits = unit.measure()
let array = bits.toArray()
if (false) array.reverse()
let result = Bits.fromArray(array).toNumber()
logger.log(`The result is ${result} / 8`)

function Circuit(name, size) {
	
	let circuit = require('../../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		render: function() {
			
			let reps = 1
			repeat(unit.length, function(index) {
				repeat(reps, function(index_) {
					let target = 3
					let control = index
					this.cu1(target, control, { lambda: 'pi/4' })
				}.bind(this))
				reps = reps * 2
			}.bind(this))
			return this
		},
		
		qft_inverse: function(begin, length) {
			
			begin = begin || 0
			length = length || this.size
			for (let i = begin, length_ = Math.floor((begin + length) / 2); i < length_; i++) {
				this.swap(i, length - (i + 1))
			}
			repeat(length, function(index) {
				this.h(begin + index)
				for (let j = index + 1; j < length; j++) {
					this.cu1(j, index, { lambda: 'pi / ' + Math.pow(2, j - index) })
				}
			}.bind(this))
			return this
		},
		
		qft_dagger: function(begin, length) {
			
			for (let i = 0, length_ = Math.floor((length) / 2); i < length_; i++) {
				this.swap(i, length - i - 1)
			}
			repeat(length, function(j) {
				for (let m = 0; m < j; m++) {
					this.cu1(m, j, { lambda: 'pi / ' + Math.pow(2, j - m) })
				}
				this.h(j)
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
