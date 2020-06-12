
const logger = require('../src/logger')()

circuit('circuit', 1).library(function(gates) {
	logger.log('library: ' + JSON.stringify(Object.keys(gates), null, 2))
})

function circuit(name, size) {
	
	return require('../src/circuit.js')({
		name: name,
		size: size,
		logger: logger,
		engine: 'optimized',
		order: ['targets', 'controls']
	})
}
