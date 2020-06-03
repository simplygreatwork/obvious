
const Bits = require('../src/bits')

encode(0)
encode(1)
encode(2)
encode(3)

function encode(value) {
	
	let circuit = Circuit('superdense-' + value, 2)
	let alice = circuit.alice()
	let bob = circuit.bob()
	circuit.entangle(alice, bob)
	alice.encode(value)
	circuit
	.detangle(alice, bob)
	.measure(alice, bob)
	.run()
	.each(function(each) {
		console.log('value encoded on alice: ' + value)
		console.log('value decoded from alice and bob: ' + each.index + '\n')
	})
}

function Circuit(name, size, options) {
	
	let circuit = require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
	
	Object.assign(circuit, {
		
		qubit: function(index) {
			
			let circuit = this
			let qubit = {
				index: index,
				apply: function() {
					let arguments_ = Array.from(arguments)
					let command = arguments_.shift()
					arguments_.unshift(this.index)
					circuit[command].apply(this, arguments_)
				}
			}
			qubit.apply = qubit.apply.bind(qubit)
			return qubit
		},
		
		alice: function() {
			
			let alice = this.qubit(0)
			Object.assign(alice, {
				encode: function(value) {
					let array = Bits.fromNumber(value, 2).toArray()
					if (array.pop()) alice.apply('z')
					if (array.pop()) alice.apply('x')
				}
			})
			return alice
		},
		
		bob: function() {
			return this.qubit(1)
		},
		
		entangle: function(alice, bob) {
			
			alice.apply('h')
			bob.apply('cx', 0)
			return this
		},
		
		detangle: function(alice, bob) {
			
			bob.apply('cx', 0)
			alice.apply('h')
			return this
		},
		
		measure: function(alice, bob) {
			return this
		}
	})
	
	return circuit
}
