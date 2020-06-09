
Circuit('phase-rotation-with-one-qubit-on', 1)
.x(0)
.repeat(9, function(index) {
	this.rz(0, [], { phi: 'pi / 18' })
})
.run('trace', 'changed')

Circuit('phase-rotation-with-four-qubits-in-superposition', 4)
.unit('all').h().circuit()
.spread(function(index) {
	this.rz(index, [], { phi: 'pi / 15' })
})
.run()


function Circuit(name, size) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		repeat: function(value, fn) {
			
			for (let i = 0; i < value; i++) {
				fn.apply(this, [i])
			}
			return this
		},
		
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
