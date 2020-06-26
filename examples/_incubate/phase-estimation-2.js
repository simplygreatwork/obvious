
var m = 3
var n = 1
qc.reset(m + n)
var output = qint.new(m, 'output')
var input = qint.new(n, 'input')
output.write(0)
input.write(0)
input.roty(-135)
estimate_phase(input, output)
output.read()

function estimate_phase(input, output, cont_u) {
	
	output.had()
	for (var j = 0; j < output.numBits; j++) {
		cont_u(output, input, 1 << j)
	}
	output.inverse_qft()
}

function cont_u(qcontrol, qtarget, control_count) {
	
	var theta = 150
	var single_operation = true
	var q1 = qcontrol.bits(control_count)
	var q2 = qtarget
	if (single_operation) {
		qc.phase(-theta / 2 * control_count, q2, q1)
		qc.cnot(q2, q1)
		qc.phase(-theta * control_count, q2, q1)
		qc.cnot(q2, q1)
		qc.phase(-theta / 2 * control_count, q2, q1)
	} else {
		for (var i = 0; i < control_count; ++i) {
			qc.phase(-theta / 2, q2, q1)
			qc.cnot(q2, q1)
			qc.phase(-theta, q2, q1)
			qc.cnot(q2, q1)
			qc.phase(-theta / 2, q2, q1)
		}
	}
}
