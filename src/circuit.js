
const math = require('mathjs')
const chalk = require('chalk')
const library = require('./derived/quantastica/gates')
const chain = require('./chain')
const unit = require('./unit')
const circuits = {}

class Circuit {
	
	constructor(options) {
		
		Object.assign(this, options)
		this.options = {}
		this.circuit = new (require('./derived/quantastica/circuit'))(this.size, this.options, this.logger)
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
		
		this.circuit.print(...arguments)		
		return this
	}
	
	peek() {
		
		this.circuit.peek(...arguments)
		return this
	}
	
	each(fn) {
		
		this.circuit.each(function() {
			fn.apply(this, arguments)
		})
		return this
	}
	
	measure() {
		return this.circuit.measure()
	}
	
	measure_() {
		return this.circuit.measure_()
	}
	
	listen() {
		
		this.circuit.on('circuit-will-run', function(circuit) {
			this.logger.log('-----------------------------------------------------------------------------------')
			this.logger.log(chalk.green.bold(`\nRunning circuit "${this.name}"\n`))
			if (this.options.trace) {
				this.circuit.capture()
				this.logger.log(chalk.blue.bold(`  Initial state`))
				this.logger.log()
				this.print()
			}
		}.bind(this))
		this.circuit.on('circuit-did-run', function(circuit) {
			this.logger.log(chalk.blue.bold(`\n  Finished "${this.name}"`))
			this.logger.log()
			this.print()
			this.logger.log()
		}.bind(this))
		this.circuit.on('gate-will-run', function(gate, index, length) {
			if (this.options.trace) {
				let string = `  Applying gate "${gate.name.toUpperCase()}" with targets ${gate.targets}`
				if (gate.controls.length > 0) string = string + ` with controls ${gate.controls}`
				if (this.options.changed) string = string + ` has changes:`
				this.logger.log(``)
				this.logger.log(chalk.blue.bold(string))
				this.logger.log(``)
			}
		}.bind(this))
		this.circuit.on('gate-did-run', function(gate, index, length) {
			if (this.options.trace) {
				this.print(this.options.changed)
			}
		}.bind(this))
	}
}

module.exports = function(options) {
	
	if (options.size !== undefined) {
		circuits[options.name] = new Circuit(options)
	}
	return circuits[options.name]
}
