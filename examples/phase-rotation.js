
const logger = require('../src/logger')()

circuit('phase rotation with 1 qubit on', 1)
.x(0)
.repeat(9, function(index) {
	this.rz(0, [], { phi: 'pi / 18' })
})
.run('trace', 'changed')

circuit('phase rotation with 4 qubits in superposition', 4)
.unit('all').h().circuit()
.spread(function(index) {
	this.rz(index, [], { phi: 'pi / 15' })
})
.run()


function circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
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
}
