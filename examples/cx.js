
const circuit = require('../src/circuit.js')

circuit('cx', 2)
.x(0)
.cx(1, 0)
.run('trace', 'changed')
