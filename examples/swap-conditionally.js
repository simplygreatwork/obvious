
const logger = require('../src/logger')()

circuit('cswap-before', 3)
.x(0)
.x(2)
.run('trace')

circuit('cswap-after', 3)
.x(0)
.x(2)
.cswap([1, 2], 0)
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
