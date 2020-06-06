
const math = require('mathjs')
const chalk = require('chalk')
const library = require('./derived/quantastica/gates')
const chain = require('./chain')
const unit = require('./unit')
const circuits = {}

class Circuit {
	
	constructor(name, size, options) {
		
		this.type = 'extended'
		this.name = name
		this.size = size
		this.options = options || {}
		this.circuit = new (require('./derived/quantastica/circuit'))(size, options)
		this.chain = new chain(this)
		this.listen()
	}
	
	library(fn) {
		
		this.circuit.library(fn)
		return this
	}
	
	addGate(name, targets, controls, options) {
		
		this.circuit.addGate(name, targets, controls, options)
		return this
	}
	
	unit(index, length) {
		
		return unit(this, index, length)
	}
	
	run() {
		
		Array.from(arguments).forEach(function(each, index) {
			this.options[each] = true
		}.bind(this))
		Object.assign(this.circuit.options, this.options)
		this.circuit.run()
		return this
	}
	
	print() {
		
		this.circuit.print()		
		return this
	}
	
	peek(fn) {
		
		this.circuit.peek(fn)	
		return this
	}
	
	each(fn) {
		
		this.circuit.each(function() {
			fn.apply(this, arguments)
		})
		return this
	}
	
	listen() {
		
		this.circuit.on('circuit-will-run', function(circuit) {
			console.log('-----------------------------------------------------------------------------------')
			console.log(chalk.green.bold(`\nRunning circuit "${this.name}"\n`));
			if (this.options.trace) {
				this.circuit.capture()
				console.log(chalk.blue.bold(`  Initial state`));
				console.log()
				this.print()
			}
		}.bind(this))
		this.circuit.on('circuit-did-run', function(circuit) {
			console.log(chalk.blue.bold(`\n  Finished "${this.name}"`));
			console.log()
			this.print()
			console.log()
		}.bind(this))
		this.circuit.on('gate-will-run', function(gate, index, length) {
			if (this.options.trace) {
				let string = `  Applying gate "${gate.name.toUpperCase()}" with targets ${gate.targets}`
				if (gate.controls.length > 0) string = string + ` with controls ${gate.controls}`
				if (this.options.changed) string = string + ` has changes:`
				console.log(``)
				console.log(chalk.blue.bold(string));
				console.log(``)
			}
		}.bind(this))
		this.circuit.on('gate-did-run', function(gate, index, length) {
			if (this.options.trace) {
				this.print(this.options.changed)
			}
		}.bind(this))
	}
}

module.exports = function(name, size) {
	
	if (size !== undefined) {
		circuits[name] = new Circuit(name, size)
	}
	return circuits[name]
}
