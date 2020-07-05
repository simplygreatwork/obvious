
const gates = require('./derived/quantastica/gates')
const Bits = require('./bits')

class Sequence {
	
	constructor(gates) {
		
		this.gates = gates || []
		this.initialize()
	}
	
	initialize() {
		
		let sequence = this
		Object.keys(gates).forEach(function(key) {
			this[key.toLowerCase()] = function(targets, controls, options) {
				let name = this
				sequence.add_gate(name, targets, controls, options)
				return sequence
			}.bind(key)
		}.bind(this))
	}
	
	add_gate(name, targets, controls, options) {
		
		this.gates.push({
			name: name,
			targets: targets,
			controls: controls,
			options: options || {}
		})
	}
	
	apply(circuit) {
		
		this.gates.forEach(function(gate) {
			circuit.add_gate(gate.name, gate.targets, gate.controls, gate.options)
		}.bind(this))
		return circuit
	}
	
	reverse() {
		return new Sequence(this.clone(this.gates).reverse())
	}
	
	clone(object) {
		return JSON.parse(JSON.stringify(object))
	}
}

module.exports = function(circuit, index, length) {
	
	return new Sequence()
}
