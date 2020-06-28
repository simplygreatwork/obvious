
const logger = require('../src/logger')()

Circuit('spread a phase rotation of a z-gate over one qubit', 1)
.unit('all').h().circuit()
.spread(function(index) {
	this.z(index, [])
})
.run()

Circuit('spread a phase rotation of a z-gate over two qubits', 2)
.unit('all').h().circuit()
.spread(function(index) {
	this.z(index, [])
})
.run()


function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		spread: function(fn) {
			
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < 1 << i; j++) {
					fn.apply(this, [i])
				}
			}
			return this
		}
	})
}
