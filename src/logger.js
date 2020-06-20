
const fs = require('fs')
const path = require('path')
const util = require('util')
const strip = require('strip-ansi')

module.exports = function(options) {
	
	options = options || {}
	let parent = path.dirname(path.dirname(process.argv[1]))
	parent = path.join(parent, 'output')
	let name = path.parse(process.argv[1]).name
	let path_ = path.join(parent, name + '.txt')
	if (! fs.existsSync(parent)) fs.mkdirSync(parent)
	options.reset = true
	if (options.reset && fs.existsSync(path_)) fs.unlinkSync(path_)
	let file = fs.createWriteStream(path_, { flags : 'a' })
	
	return {
		
		reset: function() {
			
			fs.createWriteStream(path_, { flags : 'w' }).write('\n')
		},
		
		log: function(message) {
			
			message = Array.from(arguments).join(', ')
			process.stdout.write(util.format(message) + '\n')
			file.write(strip(util.format(message)) + '\n')
		}
	}
}
