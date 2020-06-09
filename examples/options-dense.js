
circuit('display every possible state outcome - even zero probablity', 3)
.run('dense')

circuit('display non-zero state outcomes only', 3)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
