
var m = 4
var n = 1
qc.reset(m + n)
var output = qint.new(m, 'output')
var input = qint.new(n, 'input')
output.write(0)
input.write(0)
input.roty(-135)
estimate_phase(input, output, cont_u)
output.read()

function estimate_phase(input, output, cont_u) {
	
	output.had()
	for (var i = 0; i < output.numBits; i++) {
		cont_u(output, input, 1 << i)
	}
	output.inverse_qft()
}

function cont_u(control, target, count) {
	
	if (count & 1) {
		target.chadamard(null, ~0, control.bits(count))
	}
}
