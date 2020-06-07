
// This example is not yet verified for correctness
// e.g. frequency = squared - state.index

period(2)
period(4)
period(8)
// period(6)

function period(period) {
	
	let size = 4
	Circuit(`period-${period}`, size)
	.period(period)
	.qft(size)
	.run()
	.each(function(state) {
		let squared = Math.pow(size, 2)
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
			
			this['period_' + period]()
			return this
		},
		
		period_2: function() {
			
			return this
			.h(0).h(1).h(2).h(3)
			.z(0)
		},
		
		period_6: function() {		// nope
			
			return this
			.unit('all').h().circuit()
			.spread(function(index) {
				this.rz(index, [], { params: { phi: "pi / 3" }})
			})
		},
		
		period_4: function() {
			
			return this
			.h(0).h(1).h(2).h(3)
			.s(0)
			.z(1)
		},
		
		period_8: function() {
			
			return this
			.h(0).h(1).h(2).h(3)
			.t(0)
			.s(1)
			.z(2)
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
			return this.qft_4()
		},
		
		qft_4: function() {
			
			return this
			.h(3).cu1(3, 2, {"params":{"lambda":"pi/2"}})
			.h(2).cu1(3, 1, {"params":{"lambda":"pi/4"}}).cu1(2, 1, {"params":{"lambda":"pi/2"}})
			.h(1).cu1(3, 0, {"params":{"lambda":"pi/8"}}).cu1(2, 0, {"params":{"lambda":"pi/4"}}).cu1(1, 0, {"params":{"lambda":"pi/2"}})
			.h(0)
			.swap(0, 3)
			.swap(1, 2)
		}
	})
	
	return circuit
}
