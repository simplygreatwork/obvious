



circuit('main', 2)
let alice = circuit('main').qubit(0)
let bob = circuit('main').qubit(1)
alice('h')
bob('cx', 0)
