
const logger = require('../src/logger')()

circuit('trace changed on', 2)
.h(0)
.h(1)
.run('trace', 'changed')

circuit('trace changed off - trace only', 2)
.h(0)
.h(1)
.run('trace')

circuit('trace off entirely', 2)
.h(0)
.h(1)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
