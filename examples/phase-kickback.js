
const logger = require('../src/logger')()

circuit('rotate the phase on qubit 0 - nothing changes because qubit 0 is off', 1)
.u1(0, [], { lambda : 'pi / 8' })
.u1(0, [], { lambda : 'pi / 4' })
.run()

circuit('rotate the phase on qubit 0 by 22.5 degrees', 1)
.x(0)
.u1(0, [], { lambda : 'pi / 8' })
.run()

circuit('rotate the phase on qubit 0 by 45 degrees', 1)
.x(0)
.u1(0, [], { lambda : 'pi / 4' })
.run()

circuit('rotate the phase on qubit 0 by 67.5 degrees', 1)
.x(0)
.u1(0, [], { lambda : 'pi / 8' })
.u1(0, [], { lambda : 'pi / 4' })
.run()

circuit('rotate the phase on qubit 0 by 67.5 degrees - meanwhile qubits 1 and 2 are in superposition', 3)
.x(0)
.h(1)
.h(2)
.u1(0, [], { lambda : 'pi / 8' })
.u1(0, [], { lambda : 'pi / 4' })
.run()

circuit('rotate the phase on qubit 0 with phase kickback from the two control qubits in superposition (trace on)', 3)
.x(0)
.h(1)
.h(2)
.cu1(0, 1, { lambda : 'pi / 8' })
.cu1(0, 2, { lambda : 'pi / 4' })
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
