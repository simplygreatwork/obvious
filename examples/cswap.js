
const circuit = require('../src/circuit.js')

circuit('cswap-before', 3)
.x(0)
.x(2)
.run('trace')

circuit('cswap-after', 3)
.x(0)
.x(2)
.cswap([1, 2], 0)
.run('trace')
