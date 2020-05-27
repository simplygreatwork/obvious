
function on(key, func) {
	
	this.channels = this.channels || {}
	if (this.channels[key] === undefined) this.channels[key] = []
	let channel = this.channels[key]
	channel.push(func)
	return function() {
		let index = channel.indexOf(func)
		channel.splice(index, 1)
	}.bind(this)
}

function once(key, func) {
	
	let off = this.on(key, function() {
		off()
		func(...arguments)
	})
}

function emit(key) {
	
	this.channels = this.channels || {}
	let channel = this.channels[key]
	if (channel) {
		for (let i = 0; i < channel.length; i++) {
			channel[channel.length - i - 1].apply(this, Array.from(arguments).splice(1))
		}
	}
}

module.exports = function() {
	
	return {
		on,
		once,
		emit
	}
}
