
let host = new Host()
host.run()

function Host() {
	
	this.primes = []
	
	Object.assign(this, {
		
		run: function(oracle) {
			
			repeat(256, function() {
				
			})
		},
		
		is_prime: function(value) {
			
			return false
		},
		
		is_semiprime: function(value) {
			
			return false
		}
	})
}

function repeat(number, fn) {
	
	for (let i = 0; i < number; i++) {
		fn.apply(this, [i])
	}
}
