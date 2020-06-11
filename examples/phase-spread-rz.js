
Circuit('spread a phase rotation of pi / 8 over four qubits', 4)
.unit('all').h().circuit()
.spread(function(index) {
	this.rz(index, [], { phi: 'pi / 8' })
})
.run()

Circuit('spread a phase rotation of pi / 8 over five qubits', 5)
.unit('all').h().circuit()
.spread(function(index) {
	this.rz(index, [], { phi: 'pi / 8' })
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
