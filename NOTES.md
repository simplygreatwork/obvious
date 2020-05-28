
- use console colors: chalk
- separate derived engines
- use facade for gates
	- to distinguish targets from controls
- find out why quantastica starts so slowly
- for adder.js example, make it easier to set and get 4-bit values

 - in addition to .each(), use .one() for adder
	 - circuit.one(function() {})
	 - or
	 - let result = circuit.one()

- consider whether to allow:
- either circuit.addGate(targets, controls)
- or circuit.addGate(controls, targets)
- e.g. circuit.options({ controls_first : true})

- allow: no-trace, no-changes

- https://github.com/unconed/mathbox
- 
adder get value index, length