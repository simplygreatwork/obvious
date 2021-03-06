
const logger = require('../src/logger')()

circuit('root of not (x)', 2)
.h(0).s(0).h(0)
.h(0).s(0).h(0)
.run()

circuit('root of not (x)', 2)
.h(0).t(0).h(0)
.h(0).t(0).t(0).t(0).h(0)
.run()

circuit('root of not (x)', 2)
.h(0).z(0).h(0)
.run()

circuit('x', 2)
.x(0)
.run()

function circuit(name, size, options) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
