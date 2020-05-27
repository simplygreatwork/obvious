
const circuit = require('../src/circuit.js')

let i = 0
circuit('circuit', 6)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.h(i++)
.run('trace', 'changed')
