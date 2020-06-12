
const logger = require('../src/logger')()

circuit('phase-rz', 1)
.x(0)
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.rz(0, [], { phi: 'pi/4' })
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
