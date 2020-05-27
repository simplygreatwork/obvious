
const math = require('mathjs')

module.exports = {
	
	resolve: function(circuit, gate, options) {
		
		var matrix = []
		gate.matrix.map(function(row) {
			var row_ = []
			row.map(function(cell) {
				if (typeof cell == 'string') {
					var params = options ? options.params || {} : {}
					var scope = {}
					gate.params.map(function(name, index) {
						scope[name] = math.evaluate(params[name])
					})
					row_.push(math.evaluate(cell, scope))
				} else {
					row_.push(cell)
				}
			})
			matrix.push(row_)
		})
		return matrix
	},
	
	apply: function(circuit, U, qubits) {
		
		const ZERO = math.complex(0, 0)
		
		function getElMask(el) {
			
			var result = 0
			qubits.map(function(qubit, index) {
				if (el & (1 << index)) {
					result |= (1 << qubit)
				}
			})
			return result
		}
		
		function getIncMask() {
			
			var result = 0
			qubits.map(function(qubit, index) {
				result |= (1 << qubit)
			})
			return result + 1
		}
		
		function getNotMask() {
			
			var result = 0
			unused.map(function(qubit, index) {
				result |= (1 << qubit)
			})
			return result
		}
		
		var newAmplitudes = {}
		var newStateBits = 0
		qubits = qubits.slice(0)
		if (circuit.reverseBitOrder) {
			for (var i = 0; i < qubits.length; i++) {
				qubits[i] = (circuit.size - 1) - qubits[i]
			}
		}
		qubits.reverse()
		var unused = []
		for (var i = 0; i < circuit.size; i++) {
			if (qubits.indexOf(i) < 0) {
				unused.push(i)
			}
		}
		var unusedCount = unused.length
		var unusedSpace = (1 << unusedCount)
		for (var el_row = 0; el_row < U.length; el_row++) {
			var row_mask = getElMask(el_row)
			for (var el_col = 0; el_col < U[el_row].length; el_col++) {
				var column_mask = getElMask(el_col)
				if ((circuit.stateBits & column_mask) == column_mask) {
					var uval = U[el_row][el_col]
					if (uval) {
						var row = row_mask
						var column = column_mask
						var counter = unusedSpace
						var counter_mask = getElMask(0)
						var inc_mask = getIncMask()
						var not_mask = getNotMask()
						var toothless = counter_mask
						while (counter--) {
							var amplitude = circuit.amplitudes[column]
							if (amplitude) {
								row = toothless | row_mask
								if (uval == 1) {
									newAmplitudes[row] = math.add(newAmplitudes[row] || ZERO, amplitude)
								} else {
									newAmplitudes[row] = math.add(newAmplitudes[row] || ZERO, math.multiply(uval, amplitude))
								}
								newStateBits |= row
							}
							toothless = (toothless + inc_mask) & not_mask
							column = toothless | column_mask
						}
					}
				}
			}
		}
		circuit.amplitudes = newAmplitudes
		circuit.stateBits = newStateBits
		if (circuit.stateBits == 0 && Object.keys(circuit.state).length == 0) {
			circuit.amplitudes['0'] = math.complex(1, 0)
		}
	}
}