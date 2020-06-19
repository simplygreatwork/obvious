
const logger = require('../src/logger')()

circuit('ccx: built in matrix', 3)
.x(0)
.x(1)
.ccx(2, [0, 1])
.run()

circuit('ccx: constructed toffoli', 3)
.x(0)
.x(1)
.toffoli(2, [0, 1])
.run()

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		toffoli: function(target, controls) {
			
			return this
			.h(target)
			.cx(target, controls[1]).tdg(target).cx(target, controls[0]).t(target)
			.cx(target, controls[1]).tdg(target).cx(target, controls[0]).t(target)
			.h(target)
			.t(controls[1])
			.cx(controls[1], controls[0])
			.t(controls[0]).tdg(controls[1])
			.cx(controls[1], controls[0])
		}
	})
	
	return circuit
}
