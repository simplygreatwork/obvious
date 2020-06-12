
const logger = require('../src/logger')()

teleport({ state: 'a', from: 1, to: 2})
teleport({ state: 'b', from: 4, to: 1})

function teleport(options) {
	
	circuit(`illustrating state \'${options.state}\' applied to the source qubit ${options.from}`, 5)
	.state(options.state, options.from)
	.run()
	
	circuit(`illustrating state \'${options.state}\' applied to the destination qubit ${options.to}`, 5)
	.state(options.state, options.to)
	.run()
	
	circuit(`set state \'${options.state}\' on the source qubit ${options.from} then teleport to the destination qubit ${options.to}`, 5)
	.state(options.state, options.from)
	.teleport(options.from, options.to)
	.measure(options.from, options.to)
	.run('trace', 'changed')
}

function circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		state: function(state, target) {
			return this['state_' + state].apply(this, [target])
		},
		
		state_a: function(target) {
			return this.h(target).r4(target).h(target).r4(target).h(target)
		},
		
		state_b: function(target) {
			return this.h(target).r8(target).h(target).r4(target).h(target)
		},
		
		teleport: function(from, to) {
			
			let transport = 0
			return this
			.h(from)
			.h(to)
			.cx(transport, to)
			.cx(transport, from)
			.h(from)
			.cx(to, transport)
			.h(to)
			.cx(to, from)
		},
		
		measure: function(from, to) {
			return this.h(from).h(0)
		}
	})
	
	return circuit
}
