
const logger = require('../src/logger')()

Circuit('spread a phase rotation of pi / 8 over four qubits', 4)
.unit('all').h().circuit()
.spread(function(index) {
	this.u1(index, [], { lambda: 'pi / 8' })
})
.run()

Circuit('spread a phase rotation of pi / 8 over five qubits', 5)
.unit('all').h().circuit()
.spread(function(index) {
	this.u1(index, [], { lambda: 'pi / 8' })
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
