
const logger = require('../src/logger')()

circuit('applying and reversing a haddamard gate', 1)
.h(0)
.h(0)
.run('trace')

circuit('applying and reversing a pauli-x (not) gate', 1)
.x(0)
.x(0)
.run('trace')

circuit('applying and reversing a phase change', 1)
.x(0)
.u1(0, [], { lambda: 'pi / 4' })
.u1(0, [], { lambda: '-pi / 4' })
.x(0)
.run('trace')

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
