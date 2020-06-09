
// This example is not yet verified for correctness
// e.g. frequency = squared - state.index
// these is a workspace to create a QFT algorithm for n-qubits: a circuit with a dynamic number of qubits
// the function below "qft_dynamic" is incomplete an is a work in process

period(2, 4)
period(4, 4)
period(8, 4)
period(2, 5)
period(4, 5)
period(8, 5)
period(2, 6)
period(4, 6)
period(8, 6)

function period(period, size) {
	
	input(period, size)
	output(period, size)
}

function input(period, size) {
	
	Circuit(`input-phases-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.run()
}

function output(period, size) {
	
	Circuit(`output-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.qft(size)
	.run()
	.each(function(state) {
		let squared = Math.pow(2, size)
		console.log(`The frequency is ${squared - state.index} from a period of ${period} in ${squared}.\n`)
	})
}

function Circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		period: function(period) {
			
			return this
			.unit('all').h().circuit()
			.spread(function(index) {
				this.rz(index, [], { params: { phi: "pi / " + period / 2 }})
			})
		},
		
		spread: function(fn) {
			
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < 1 << i; j++) {
					fn.apply(this, [i])
				}
			}
			return this
		},
		
		qft: function(size) {
			return this['qft_' + this.size]()
		},
		
		qft_4: function() {
			
			return this
			.h(3)
				.cu1(3, 2, {"params":{"lambda":"pi/2"}})
			.h(2)
				.cu1(3, 1, {"params":{"lambda":"pi/4"}})
				.cu1(2, 1, {"params":{"lambda":"pi/2"}})
			.h(1)
				.cu1(3, 0, {"params":{"lambda":"pi/8"}})
				.cu1(2, 0, {"params":{"lambda":"pi/4"}})
				.cu1(1, 0, {"params":{"lambda":"pi/2"}})
			.h(0)
			.swap(0, 3)
			.swap(1, 2)
		},
		
		qft_5: function() {
			
			return this
			.h(4)
				.cu1(4, 3, {"params":{"lambda":"pi/2"}})
			.h(3)
				.cu1(4, 2, {"params":{"lambda":"pi/4"}})
				.cu1(3, 2, {"params":{"lambda":"pi/2"}})
			.h(2)
				.cu1(4, 1, {"params":{"lambda":"pi/8"}})
				.cu1(3, 1, {"params":{"lambda":"pi/4"}})
				.cu1(2, 1, {"params":{"lambda":"pi/2"}})
			.h(1)
				.cu1(4, 0, {"params":{"lambda":"pi/16"}})
				.cu1(3, 0, {"params":{"lambda":"pi/8"}})
				.cu1(2, 0, {"params":{"lambda":"pi/4"}})
				.cu1(1, 0, {"params":{"lambda":"pi/2"}})
			.h(0)
			.swap(0, 4)
			.swap(1, 3)
		},
		
		qft_6: function() {
			
			return this
			.h(5)
				.cu1(5, 4, {"params":{"lambda":"pi/2"}})
			.h(4)
				.cu1(5, 3, {"params":{"lambda":"pi/4"}})
				.cu1(4, 3, {"params":{"lambda":"pi/2"}})
			.h(3)
				.cu1(5, 2, {"params":{"lambda":"pi/8"}})
				.cu1(4, 2, {"params":{"lambda":"pi/4"}})
				.cu1(3, 2, {"params":{"lambda":"pi/2"}})
			.h(2)
				.cu1(5, 1, {"params":{"lambda":"pi/16"}})
				.cu1(4, 1, {"params":{"lambda":"pi/8"}})
				.cu1(3, 1, {"params":{"lambda":"pi/4"}})
				.cu1(2, 1, {"params":{"lambda":"pi/2"}})
			.h(1)
				.cu1(5, 0, {"params":{"lambda":"pi/32"}})
				.cu1(4, 0, {"params":{"lambda":"pi/16"}})
				.cu1(3, 0, {"params":{"lambda":"pi/8"}})
				.cu1(2, 0, {"params":{"lambda":"pi/4"}})
				.cu1(1, 0, {"params":{"lambda":"pi/2"}})
			.h(0)
			.swap(0, 5)
			.swap(1, 4)
			.swap(2, 3)
		},
		
		qft_dynamic: function() {				// work in process
			
			this.repeat(this.size, function(index) {
				let inverse = this.size - 1 - index
				this.h(inverse)
				console.log('h: ' + inverse)
				for (let j = inverse; j > 0; j--) {
					let divisor = Math.pow(2, j)
					let lambda = 'pi / ' + divisor
					this.cu1(inverse, j, {"params":{"lambda": lambda}})
					console.log('cu1: ', j, index, lambda)
				}
			}.bind(this))
			for (let i = 0, length = Math.floor(this.size / 2); i < length; i++) {
				this.swap(i, this.size - (i + 1))
			}
			return this
		},
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [i])
			}
			return this
		}
	})
	
	return circuit
}
