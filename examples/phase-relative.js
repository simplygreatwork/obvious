
const logger = require('../src/logger')()

circuit('a quarter turn (90 degree) relative phase change in super position with an S gate', 1)
.h(0)
.s(0)
.run()
.inspect()

circuit('a quarter turn (90 degree) relative phase change in super position with the U1 gate', 1)
.h(0)
.u1(0, [], { lambda: 'pi / 2' })
.run()
.inspect()

circuit('a quarter turn (90 degree) relative phase change in super position with an RZ gate', 1)
.h(0)
.rz(0, [], { phi: 'pi / 2' })
.run()
.inspect()

function circuit(name, size) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	return Object.assign(circuit, {
		
		inspect: function() {
			
			let phase = 0
			this.each(function(each) {
				phase = phase + Math.abs(each.phase)
			})
			logger.log(`In superposition the relative phase between states is ${phase} degrees.`)
			logger.log()
		}
	})
}
