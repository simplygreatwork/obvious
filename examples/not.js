
circuit('setting the first bit (0) changes the rightmost bit below', 10)
.x(0)
.run('trace')

circuit('setting the last bit (0) changes the leftmost bit below', 10)
.x(9)
.run('trace')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
