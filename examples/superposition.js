
let i = 0
circuit('superposition', 6)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'quantastica',
		order: ['targets', 'controls']
	})
}
