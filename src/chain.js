
module.exports = class Chain {
	
	constructor(circuit) {
		
		this.circuit = circuit
		this.simple(require('./derived/quantastica/gates'))
		if (false) this.composite(require('./composites/index'))
	}
	
	simple(gates) {
		
		let chain = this
		Object.keys(gates).forEach(function(key) {
			let circuit = this.circuit
			circuit[key.toLowerCase()] = function(targets, controls, options) {
				let name = this
				targets = targets.length ? targets : [targets]
				if (controls !== undefined) controls = controls.length ? controls : [controls]
				controls = controls || []
				let wires = controls.concat(targets)
				circuit.addGate(name, wires, options)
				return circuit
			}.bind(key)
		}.bind(this))
	}
	
	composite(gates) {
		
		let chain = this
		Object.keys(gates).forEach(function(key) {
			let circuit = this.circuit
			this[key.toLowerCase()] = function() {
				gates[key](circuit, ...arguments)
				return chain
			}.bind(key)
		}.bind(this))
	}
	
	measure() {
		
		return this
	}
	
	barrier() {
		
		return this
	}
	
	verbose() {
		
		return this.circuit
	}
	
	run() {
		
		this.circuit.run(...arguments)
		return this.circuit
	}
}
