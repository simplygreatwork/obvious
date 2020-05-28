
circuit('rz', 1)
.x(0)
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.rz(0, [], { params: { phi: "pi/4" }})
.run('trace', 'changed')

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
