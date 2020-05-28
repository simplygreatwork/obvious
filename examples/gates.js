
circuit('circuit', 1).library(function(gates) {
	console.log('library: ' + JSON.stringify(Object.keys(gates), null, 2))
})

function circuit(name, size) {
	
	return require('../src/circuit.js')(name, size, {
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
