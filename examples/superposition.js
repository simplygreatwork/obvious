
const logger = require('../src/logger')()

let i = 0
circuit('superposition-individually', 4)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.run('trace', 'changed')

circuit('superposition-of-unit', 4)
.unit('all').h()
.circuit()
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
