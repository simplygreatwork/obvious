
Circuit('spread a phase rotation over three qubits using a t-gate', 3)
.unit('all').h().circuit()
.spread(function(index) {
	this.t(index, [])
})
.run()

Circuit('spread a phase rotation over four qubits using a t-gate', 4)
.unit('all').h().circuit()
.spread(function(index) {
	this.t(index, [])
})
.run()


function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')(name, size, {
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
