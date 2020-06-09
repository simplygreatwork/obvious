
// the frequency results here tend to be approximate
// the periods do not fit neatly into the resulting state vector; e.g. 16 / 3 = 5.3333 instead of 16 / 4 = 4
// for periods with these remainders, I need more study to determine whether to round down
// this example is not yet verified for correctness; e.g. frequency = squared - state.index

frequency ({ period: 3, size: 4 })
frequency ({ period: 5, size: 4 })
frequency ({ period: 6, size: 4 })
frequency ({ period: 7, size: 4 })
frequency ({ period: 10, size: 5 })
frequency ({ period: 10, size: 6 })

function frequency(options) {
	
	input(options.period, options.size)
	output(options.period, options.size)
}

function input(period, size) {
	
	Circuit(`input-phases-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.run()
}

function output(period, size) {
	
	let result = { index: -1, magnitude: 0}
	Circuit(`output-for-a-period-of-${period}-using-${size}-qubits`, size)
	.period(period)
	.qft(size)
	.run()
	.each(function(state) {
		if (state.magnitude > result.magnitude) result = state
	})
	let squared = Math.pow(2, size)
	console.log(`The frequency is approximately ${squared - result.index} from a period of ${period} in ${squared}.\n`)
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
		}
	})
	
	return circuit
}
