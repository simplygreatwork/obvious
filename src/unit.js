
const gates = require('./derived/quantastica/gates')

class Unit {
	
	constructor(circuit, index, length) {
		
		this.circuit_ = circuit
		if ((index == 'all') || (index == '*') || (index === undefined)) {
			index = 0
			length = circuit.size
		}
		this.index = index
		this.length = length || 1
		this.initialize()
	}
	
	initialize() {
		
		let unit = this
		Object.keys(gates).forEach(function(key) {
			let circuit = this.circuit_
			this[key.toLowerCase()] = function(controls, options) {
				let name = this
				for (let target = unit.index; target < unit.index + unit.length; target++) {
					circuit.addGate(name, [target], controls, options)
				}
				return unit
			}.bind(key)
		}.bind(this))
	}
	
	circuit() {
		return this.circuit_
	}
	
	unit(index, length) {
		
		if (this.length > 0) {
			return new Unit(this.circuit, this.index + index, length)
		} else {
			return null
		}
	}
	
	read() {
		return
	}
	
	write(value) {
		return
	}
	
	measure() {
		return
	}
}

module.exports = function(circuit, index, length) {
	
	return new Unit(circuit, index, length)
}
