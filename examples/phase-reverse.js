
const logger = require('../src/logger')()

circuit('attempting to change phase has no effect if the qubit is not on', 1)
.rz(0, [], { phi: 'pi / 4' })
.run('trace')

circuit('change phase and then reverse using Z axis rotation', 1)
.x(0)
.rz(0, [], { phi: 'pi / 4' })
.rz(0, [], { phi: '- pi / 4' })
.run('trace', 'changed')

circuit('change phase using an s-gate and then reverse using an s-dagger gate', 1)
.x(0)
.s(0)
.sdg(0)
.run('trace', 'changed')

circuit('change the phase using a t-gate and then reverse using a t-dagger gate', 1)
.x(0)
.t(0)
.tdg(0)
.run('trace', 'changed')

circuit('change the phase using an s-gate and then reverse using 2 t-dagger gates', 1)
.x(0)
.s(0)
.tdg(0)
.tdg(0)
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
