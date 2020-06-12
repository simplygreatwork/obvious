
const logger = require('../src/logger')()

circuit('bell-phase', 2)
.h(0)
.t(0)
.h(0)
.cx(1, 0)
.run()

circuit('bell-phase', 2)
.h(0)
.t(0)
.t(0)
.h(0)
.cx(1, 0)
.run()

circuit('bell-phase', 2)
.h(0)
.t(0)
.t(0)
.t(0)
.h(0)
.cx(1, 0)
.run()

circuit('bell-phase', 2)
.h(0)
.t(0)
.t(0)
.t(0)
.t(0)
.h(0)
.cx(1, 0)
.run()

circuit('bell-phase', 2)
.h(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.t(0)
.h(0)
.cx(1, 0)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
