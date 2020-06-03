
circuit('bell', 2)
.h(0)
.cx(1, 0)
.run()

circuit('bell-opposite', 2)
.h(0)
.cx(1, 0)
.x(0)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
