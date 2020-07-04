
const logger = require('../src/logger')()

circuit('phase: u1', 1)
.x(0)
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
.u1(0, [], { lambda: 'pi/4' })
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
