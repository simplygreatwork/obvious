
const logger = require('../src/logger')()

circuit('rotation-z', 1)
.x(0).z(0)
.run()

circuit('rotation-rz', 1)
.x(0).rz(0, [], { phi: 'pi'})
.run()

circuit('rotation-u1', 1)
.x(0).u1(0, [], { lambda: 'pi'})
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
