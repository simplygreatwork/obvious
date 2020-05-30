
circuit('toffoli (ccx)', 4)
.run()

function circuit(name, size, options) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
