
const circuit = require('../src/circuit.js')

circuit('bell', 2)
.h(0)
.cx(1, 0)
.run('trace', 'changed')

circuit('bell-opposite', 2)
.h(0)
.cx(1, 0)
.x(0)
.run('trace', 'changed')
