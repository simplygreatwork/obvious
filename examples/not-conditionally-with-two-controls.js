
circuit('ccx false', 3)
.x(0)
.ccx(2, [0, 1])
.run()

circuit('ccx true', 3)
.x(0)
.x(1)
.ccx(2, [0, 1])
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
