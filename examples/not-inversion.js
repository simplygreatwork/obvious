
const logger = require('../src/logger')()

circuit('the x (not) gate inverts the magnitude and hence probability between the qubit up and down states and back', 1)
.h(0).t(0).h(0)
.x(0)
.x(0)
.x(0)
.run('trace')

circuit('and also of course inverts from zero to one and back', 1)
.x(0)
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
