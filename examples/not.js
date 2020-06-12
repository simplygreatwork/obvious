
const logger = require('../src/logger')()

circuit('setting the first bit changes the rightmost bit below', 10)
.x(0)
.run('trace')

circuit('setting the last bit changes the leftmost bit below', 10)
.x(9)
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
