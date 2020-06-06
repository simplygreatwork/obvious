
module.exports = class Chain {
	
	constructor(circuit) {
		
		this.circuit = circuit
		this.simple(require('./derived/quantastica/gates'))
		if (false) this.composite(require('./composites/index'))
	}
	
	simple(gates) {
		
		Object.keys(gates).forEach(function(key) {
			let circuit = this.circuit
			circuit[key.toLowerCase()] = function(targets, controls, options) {
				let name = this
				circuit.addGate(name, targets, controls, options)
				return circuit
			}.bind(key)
		}.bind(this))
	}
	
	composite(gates) {
		
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