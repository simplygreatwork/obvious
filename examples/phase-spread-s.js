
const logger = require('../src/logger')()

Circuit('spread a phase rotation of an s-gate over two qubits', 2)
.unit('all').h().circuit()
.spread(function(index) {
	this.s(index, [])
})
.run()

Circuit('spread a phase rotation of an s-gate over three qubits', 3)
.unit('all').h().circuit()
.spread(function(index) {
	this.s(index, [])
})
.run()

function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		spread: function(fn) {
			
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < 1 << i; j++) {
					fn.apply(this, [i])
				}
			}
			return this
		}
	})
	
	return circuit	
}
