
const logger = require('../src/logger')()

circuit('a quarter turn (90 degree) relative phase change in super position with ui gate', 1)
.h(0)
.u1(0, [], { lambda: 'pi / 2' })
.run()

circuit('a quarter turn (90 degree) relative phase change in super position with an rz gate', 1)
.h(0)
.rz(0, [], { phi: 'pi / 2' })
.run()

circuit('a quarter turn (90 degree) relative phase change in super position with an s gate', 1)
.h(0)
.s(0)
.run()

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
