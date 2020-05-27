
const numeric = require('../lib/numeric.js')
const library = require('./gates.js')
const precision = 8

// this derivation of qcsimulator is incomplete and not yet fully integrated with quantify
// use derived/quantastica instead

module.exports = class Circuit {
	
	constructor(size, options) {
		
		this.size = size
		this.options = options || []
		this.gates = []
		const squared = Math.pow(2, size)
		this.amplitudes = new numeric.T(numeric.rep([squared], 0), numeric.rep([squared], 0))
		this.amplitudes.x[0] = 1
		this.emitter = require('./emitter')()
	}
	
	addGate(name, wires, options) {
		
		if (! library[name]) {
			console.error('Unknown gate "' + name + '".');
		} else {
			this.gates.push({
				name: name,
				matrix: library[name],
				wires: wires
			})
		}
	}
	
	run() {
		
		this.emit('circuit-will-run', this)
		this.gates.forEach(function(gate, index) {
			this.emit('gate-will-run', gate, index, this.gates.length)
			let matrix = gate.matrix(gate.targets.length)
			gate.controls.forEach(function(control) {
				matrix = this.controlled(matrix)
			}.bind(this))
			const qubits = gate.controls.concat(gate.targets)
			this.amplitudes = this.expand(matrix, this.size, qubits).dot(this.amplitudes)
			this.emit('gate-did-run', gate, index, this.gates.length)
		}.bind(this))
		this.amplitudes = this.amplitudes.div(this.amplitudes.norm2())
		this.state = this.state_()
		this.emit('circuit-did-run', this)
		return this
	}
	
	print() {
		
		console.log()
		this.state.forEach(function(each, index) {
			if (this['changed?'](each, index)) {
				console.log(`    |${each.bits}> ${each.probability} ${each.amplitude} ${each.phase} (was ${this.last[index].probability} ${this.last[index].amplitude})`)
			} else {
				if (each.probability != '0.0000%') {
					console.log(`    |${each.bits}> ${each.probability} ${each.amplitude} ${each.phase} `)
				}
			}
		}.bind(this))
		return this
	}
	
	'changed?'(state, index) {
		
		if (this.last) {
			if (state.amplitude != this.last[index].amplitude) return true
			if (state.probability != this.last[index].probability) return true
		}
		return false
	}
	
	each(fn) {
		
		this.state.forEach(function(each, index) {
			if (each.probability != '0.0000%') {
				fn(each)
			}
		}.bind(this))
	}
	
	state_() {
		
		let results = []
		this.amplitudes.x.forEach(function(each, i) {
			results.push({
				bits: this.bits_(i),
				amplitude: this.amplitude_(i),
				probability: this.probability_(i),
				phase: this.phase(i),
			})
		}.bind(this))
		return results
	}
	
	bits_(index) {
		
		let result = ''
		for (let i = 0; i < this.size; i++) {
			result = ((index & (1 << i)) >> i) + result
		}
		return result
	}
	
	amplitude_(index) {
		
		let result = []
		result.push(this.amplitudes.x[index].toFixed(precision))
		result.push(this.amplitudes.y[index] < 0 ? '-' : '+')
		result.push(Math.abs(this.amplitudes.y[index]).toFixed(precision) + 'i')
		return result.join('')
	}
	
	probability_(index) {
		return (this.magnitude(index) * 100).toFixed(4) + '%'
	}
	
	magnitude(index) {
		return Math.pow(this.real(index), 2) + Math.pow(this.imaginary(index), 2)
	}
	
	phase_(index) {
		return Math.atan2(this.imaginary(index), this.real(index))
	}
	
	phase(index) {
		return this.phase_(index)  * 360 / (Math.PI * 2)
	}
	
	real(index) {
		return this.amplitudes.x[index]
	}
	
	imaginary(index) {
		return this.amplitudes.y[index]
	}
	
	// Returns a version of U controlled by first qubit
	
	controlled(matrix) {
		
		const m = matrix.x.length
		const Mx = numeric.identity(m * 2)
		const My = numeric.rep([m * 2, m * 2], 0)
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < m; j++) {
				Mx[i + m][j + m] = matrix.x[i][j]
				My[i + m][j + m] = matrix.y[i][j]
			}
		}
		return new numeric.T(Mx, My)
	}
	
	// Returns a transformation over the entire the register which applies U to the specified qubits in order given
	// Algorithm from Lee Spector's "Automatic Quantum Computer Programming"
	
	expand(matrix, size, qubits) {
		
		const qubits_ = []
		const n = Math.pow(2, size)
		qubits = qubits.slice(0)
		for (let i = 0; i < qubits.length; i++) {
			qubits[i] = (size - 1) - qubits[i]
		}
		qubits.reverse()
		for (let i = 0; i < size; i++) {
			if (qubits.indexOf(i) == -1) {
				qubits_.push(i)
			}
		}
		const X = numeric.rep([n, n], 0)
		const Y = numeric.rep([n, n], 0)
		let i = n
		while (i--) {
			let j = n
			while (j--) {
				let equals = true
				let k = qubits_.length
				while (k--) {
					if ((i & (1 << qubits_[k])) != (j & (1 << qubits_[k]))) {
						equals = false
						break
					}
				}
				if (equals) {
					let istar = 0
					let jstar = 0
					let k = qubits.length
					while (k--) {
						const q = qubits[k]
						istar |= ((i & (1 << q)) >> q) << k
						jstar |= ((j & (1 << q)) >> q) << k
					}
					X[i][j] = matrix.x[istar][jstar]
					Y[i][j] = matrix.y[istar][jstar]
				}
			}
		}
		return new numeric.T(X, Y)
	}
	
	on(key, func) {
		this.emitter.on(key, func)
	}
	
	emit() {
		this.emitter.emit(...arguments)
	}
}
