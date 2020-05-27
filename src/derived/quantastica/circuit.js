
const math = require('mathjs')
const chalk = require('chalk')
const library = require('./gates')
const transform = require('./transform')
const format = require('./format')

module.exports = class Circuit {
	
	constructor(size, options) {
		
		this.size = size
		this.options = options || {}
		this.gates = []
		this.reverseBitOrder = false
		this.amplitudes = {'0': math.complex(1, 0)}
		this.stateBits = 0
		this.emitter = require('./emitter')()
	}
	
	addGate(name, wires, options) {
		
		if (! library[name]) {
			console.error('Unknown gate "' + name + '".');
		} else {
			this.gates.push({
				name: name,
				wires: wires,
				options: options || {}
			})
		}
	}
	
	run(options) {
		
		options = options || {}
		this.emit('circuit-will-run', this)
		this.gates.forEach(function(gate, index) {
			this.emit('gate-will-run', gate, index, this.gates.length)
			let matrix = transform.resolve(this, library[gate.name], gate.options)
			transform.apply(this, matrix, gate.wires)
			this.capture()
			this.emit('gate-did-run', gate, index, this.gates.length)
		}.bind(this))
		this.emit('circuit-did-run', this)
		return this
	}
	
	capture() {
		
		this.last = this.state
		this.state = {}
		for (var index = 0, length = math.pow(2, this.size); index < length; index++) {
			let amplitude = math.round(this.amplitudes[index] || math.complex(0, 0), 14)
			if (amplitude.re || amplitude.im) {
				this.state[index] = this.formulate(amplitude, index)
			}
		}
	}
	
	formulate(amplitude, index) {
		
		let bits = index.toString(2)
		while (bits.length < this.size) {
			bits = '0' + bits
		}
		if (false) bits = bits.split('0').join(' ')		// fix adder example
		let magnitude = math.pow(math.abs(amplitude), 2)
		let probability = (magnitude * 100).toFixed(4).padStart(9, ' ')
		return {
			index: index,
			bits: bits,
			amplitude: format.complex(amplitude, {
				fixedWidth: true,
				scale: 8,
				iotaChar: 'i'
			}),
			magnitude: magnitude,
			probability: probability,
			phase: (Math.atan2(amplitude.im, amplitude.re) * 360 / (Math.PI * 2)).toFixed(2).padStart(6, ' ')
		}
	}
	
	print(changes) {
		
		if (changes) {
			this.changes(function(now, then, index) {
				let message = []
				message.push(`    |${now.bits}> ${now.probability}% ${now.amplitude} (${now.phase}) `)
				message.push(chalk.grey.bold(` <<< ${then.probability}% ${then.amplitude} (${now.phase})`))
				console.log(message.join(''))
			})
		} else {
			this.each(function(now, index) {
				console.log(`    |${now.bits}> ${now.probability}% ${now.amplitude} (${now.phase})`)
			})
		}
		return this
	}
	
	each(fn) {
		
		for (var index = 0, length = math.pow(2, this.size); index < length; index++) {
			if (this.state[index]) {
				fn(this.state[index], index)
			}
		}
	}
	
	changes(fn) {
		
		for (var index = 0, length = math.pow(2, this.size); index < length; index++) {
			if (this['changed?'](index)) {
				let now = this.state ? this.state[index] || this.formulate(math.complex(0, 0), index) : this.calculate(math.complex(0, 0), index)
				let then = this.last ? this.last[index] || this.formulate(math.complex(0, 0), index) : this.calculate(math.complex(0, 0), index)
				fn(now, then, index)
			}
		}
	}
	
	'changed?'(index) {
		
		if (this.last) {
			if (this.last[index] && (! this.state[index])) {
				return true
			} else if ((! this.last[index]) && this.state[index]) {
				return true
			} else if (this.last[index] && this.state[index]) {
				if (this.state[index].amplitude != this.last[index].amplitude) return true
				if (this.state[index].probability != this.last[index].probability) return true
			}
		}
		return false
	}
	
	on(key, func) {
		this.emitter.on(key, func)
	}
	
	emit() {
		this.emitter.emit(...arguments)
	}
}
