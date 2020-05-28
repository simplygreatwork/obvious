
circuit('t', 1)
.x(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
