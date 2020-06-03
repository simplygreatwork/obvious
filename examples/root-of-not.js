
circuit('root of not (x)', 2)
.h(0).s(0).h(0)
.h(0).s(0).h(0)
.run()

circuit('root of not (x)', 2)
.h(0).t(0).h(0)
.h(0).t(0).t(0).t(0).h(0)
.run()

function circuit(name, size, options) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
