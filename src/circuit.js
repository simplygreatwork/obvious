
const math = require('mathjs')
const chalk = require('chalk')
const library = require('./derived/quantastica/gates')
const chain = require('./chain')
const circuits = {}

class Circuit {
	
	constructor(name, size, options) {
		
		this.name = name
		this.options = options || {}
		this.circuit = new (require('./derived/quantastica/circuit'))(size, options)
		this.chain = new chain(this)
		this.listen()
	}
	
	addGate(name, wires, options) {
		this.circuit.addGate(name, wires, options)		
	}
	
	run() {
		
		this.flags(...arguments)
		this.circuit.run(...arguments)
		return this
	}
	
	flags() {
		
		Array.from(arguments).forEach(function(each, index) {
			this.options[each] = true
		}.bind(this))
		Object.assign(this.circuit.options, this.options)
	}
	
	print(compact) {
		
		this.circuit.print(compact)		
		return this
	}
	
	listen() {
		
		this.circuit.on('circuit-will-run', function(circuit) {
			console.log('-----------------------------------------------------------------------------------')
			console.log(chalk.blue.bold(`\nRunning circuit "${this.name}"\n`));
			if (this.options.trace) {
				this.circuit.capture()
				console.log()
				console.log(chalk.green.bold(`  Initial state`));
				console.log()
				this.print()
			}
		}.bind(this))
		this.circuit.on('circuit-did-run', function(circuit) {
			console.log(chalk.green.bold(`\n  Finished "${this.name}"`));
			console.log()
			this.print()
		}.bind(this))
		this.circuit.on('gate-will-run', function(gate, index, length) {
			if (this.options.trace) {
				console.log(``)
				if (this.options.changed) {
					console.log(chalk.green.bold(`  Applied gate "${gate.name.toUpperCase()}" changes:`));
				} else {
					console.log(chalk.green.bold(`  Applied gate "${gate.name.toUpperCase()}"`));
				}
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
