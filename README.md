
## A small, hackable, optimized framework for learning quantum computing with examples.

## Features

- A small, hackable, optimized framework for learning quantum computing with examples.
- Trace gate operations to display state changes as gates are applied.
- Prints amplitude, probability, and phase.
- Reasonably performant for 10 - 20 qubits using the quantastica engine.
- The primary focus is to create a breadth of easy to follow quantum computing examples.
- Compare and contrast desired outcomes and non-desired outcomes.
- Wherever possible, display input state alone first and then output state.

## Examples

- [encode two classical bits inside a single qubit](/examples/superdense.js)
- [amplify a probability amplitude](/examples/amplify.js)
- [teleport the state of one qubit to another qubit](/examples/teleportation.js)
- [find the frequency of a period of phases](/examples/frequency.js)
- [add two integers](/examples/adder.js)
- [create a bell state](/examples/bell-state.js)
- [create a GHZ state](/examples/ghz-state.js)
- [rotate phase](/examples/phase-rotation.js)
- [implement a two condition not operator](/examples/not-conditionally-toffoli-constructed.js)
- [the Deutsch-Jozsa algorithm: a classical illustration](/examples/algorithm-constant-or-balanced-classical.js)
- [the Deutsch-Jozsa algorithm: a quantum implementation](/examples/algorithm-constant-or-balanced-quantum.js)
- [the Bernstein-Vazirani algorithm: a classical illustration](/examples/algorithm-bitstring-query-classical.js)
- [the Bernstein-Vazirani algorithm: a quantum implementation](/examples/algorithm-bitstring-query-quantum.js)
- [Simon's algorithm: a classical illustration](/examples/algorithm-exclusive-or-pairs-classical.js)
- [more examples](/examples/)

## Install

```
git clone https://github.com/simplygreatwork/obvious.git
npm install
cd examples
node amplify.js
```

## Simulation

- Currently based on a condensed implementation of Quantastica's Quantum Circuit.
	- https://github.com/quantastica/quantum-circuit
- Previous engines have been or are based on:
	- https://github.com/adamisntdead/qics
	- https://github.com/qcsimulator/qcsimulator.github.io

## Special thanks (acknowledgements and attribution)

- Thank you to [David B Kemp](http://davidbkemp.github.io/). Occasionally, I ping David with emails about his project jsqubits. He is super helpful.
- Thank you to Quantastica for publishing the simulator Quantum Circuit using an MIT license. I am current using a paired down version of Quantum Circuit for these quantum examples.

## Goals

- Create simple examples of basic quantum circuits.
	- Even go as far as to illustrate concepts such as:
		- 	how phase is calculated
		- 	how magnitude is calculated
		- 	matrix multiplication
		- 	Math.log
		- 	Math.Pi
		- 	angles and radian conversion
		- 	least common multiple
		- 	greatest common denominator
		- 	continued fractions
		- 	power mod
		- 	power factor
		- 	binary bit math
		- 	complex numbers
	
- Keep as much helper code inside each example. Try not to obfuscate with additional separate layers.
	- If an example illustrates the quantum fourier transform primarily, implement the QFT as a seperate function inside the example.
	- If an example entangles two qubits, implement the entanglement as a seperate function inside the example.
	- If an example uses a qubit or qubit range helper object, implement as a seperate function inside the example.
	
- Keep helper modules as composible and as independent as possible:
	- For example, converting bit arrays to and from integers and strings is implemented independently from circuits.
	- For example, the core circuit implementations are seperate from the circuit class used by examples.
		- Allows for custom displays and custom debugging and tracing.
		- Keeps the core circuit and gate implementations tight and focused.

## References & Links

- https://github.com/pnnl/QASMBench
- https://www.oreilly.com/library/view/programming-quantum-computers/978149203967/9
- https://oreilly-qc.github.io/
- https://quantum-circuit.com/
- https://github.com/quantastica/quantum-circuit
- http://davidbkemp.github.io/
- http://qcsimulator.github.io/
- https://github.com/adamisntdead/qics
- https://www.quantum-inspire.com/
- https://qiskit.org/
