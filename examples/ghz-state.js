
circuit('ghz', 3)
.h(0)
.cx(1, 0)
.cx(2, 1)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}

// Greenberger–Horne–Zeilinger state
