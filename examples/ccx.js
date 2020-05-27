
const circuit = require('../src/circuit.js')

circuit('ccx', 3)
.x(0)
.x(1)
.ccx(2, [0, 1])
.run('trace', 'changed')
