

Circuit('superposition-b', 4)
.unit('all').h()
.circuit()
.run()

Circuit('superposition-b', 4)
.unit('*').h()
.circuit()
.run()

Circuit('superposition-c', 4)
.unit().h()
.circuit()
.run()

function Circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'quantastica',
		order: ['targets', 'controls']
	})
}
