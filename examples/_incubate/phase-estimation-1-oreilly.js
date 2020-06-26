
var m = 4
var n = 1
qc.reset(m + n)
var qout = qint.new(m, 'output')
var qin = qint.new(n, 'input')
qout.write(0)
qc.label('init')
qin.write(0)
qin.roty(-135)

function cont_u(qcontrol, qtarget, control_count) {
	
	if (control_count & 1) {
		qtarget.chadamard(null, ~0, qcontrol.bits(control_count))
	}
}

phase_est(qin, qout, cont_u)
qout.read()

function phase_est(q_in, q_out, cont_u) {
	
	q_out.had()
	for (var j = 0; j < q_out.numBits; j++) {
	cont_u(q_out, q_in, 1 << j);
	}
	q_out.invQFT()
}
