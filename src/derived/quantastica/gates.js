
module.exports = {
	
	id: {
		description: "Single qubit identity gate",
		matrix: [
			[1, 0],
			[0, 1]
		],
		params: []
	},
	x: {
		description: "Pauli X (PI rotation over X-axis) aka \"NOT\" gate",
		matrix: [
			[0,1],
			[1,0]
		],
		params: [],
	},
	y: {
		description: "Pauli Y (PI rotation over Y-axis)",
		matrix: [
			[0,"-i"],
			["i",0]
		],
		params: [],
	},
	z: {
		description: "Pauli Z (PI rotation over Z-axis)",
		matrix: [
			[1,0],
			[0,-1]
		],
		params: []
	},
	h: {
		description: "Hadamard gate",
		matrix: [
			["1 / sqrt(2)","1 / sqrt(2)"],
			["1 / sqrt(2)","-1 / sqrt(2)"]
		],
		params: []
	},
	srn: {
		description: "Square root of NOT",
		matrix: [
			["0.5+0.5i","0.5-0.5i"],
			["0.5-0.5i","0.5+0.5i"]
		],
		params: []
	},
	r2: {
		description: "PI/2 rotation over Z-axis aka \"Phase PI/2\"",
		matrix: [
			[1,0],
			[0,"exp(i * pi / 2)"]
		],
		params: []
	},
	r4: {
		description: "PI/4 rotation over Z-axis aka \"Phase PI/4\"",
		matrix: [
			[1,0],
			[0,"exp(i * pi / 4)"]
		],
		params: []
	},
	r8: {
		description: "PI/8 rotation over Z-axis aka \"Phase PI/8\"",
		matrix: [
			[1,0],
			[0,"exp(i * pi / 8)"]
		],
		params: []
	},
	rx: {
		description: "Rotation around the X-axis by given angle",
		matrix: [
			["cos(theta / 2)", "-i * sin(theta / 2)"],
			["-i * sin(theta / 2)", "cos(theta / 2)"]
		],
		params: ["theta"]
	},
	ry: {
		description: "Rotation around the Y-axis by given angle",
		matrix: [
			["cos(theta / 2)", "-1 * sin(theta / 2)"],
			["sin(theta / 2)", "cos(theta / 2)"]
		],
		params: ["theta"]
	},
	rz: {
		description: "Rotation around the Z-axis by given angle",
		matrix: [
			["cos(phi / 2) - i * sin(phi / 2)", 0],
			[0, "cos(phi / 2) + i * sin(phi / 2)"]
		],
		params: ["phi"]
	},
	u1: {
		description: "1-parameter 0-pulse single qubit gate",
		matrix: [
			[1,0],
			[0,"exp(i * lambda)"]
		],
		params: ["lambda"]
	},
	u2: {
		description: "2-parameter 1-pulse single qubit gate",
		matrix: [
			["1 / sqrt(2)", "-exp(i * lambda) * 1 / sqrt(2)"],
			["exp(i * phi) * 1 / sqrt(2)", "exp(i * lambda + i * phi) * 1 / sqrt(2)"]
		],
		params: ["phi", "lambda"]
	},
	u3: {
		description: "3-parameter 2-pulse single qubit gate",
		matrix: [
			[ "cos(theta/2)", "-exp(i * lambda) * sin(theta / 2)" ],
			[ "exp(i * phi) * sin(theta / 2)", "exp(i * lambda + i * phi) * cos(theta / 2)" ]
		],
		params: ["theta", "phi", "lambda"]
	},
	s: {
		description: "PI/2 rotation over Z-axis (synonym for `r2`)",
		matrix: [
			[1,0],
			[0,"exp(i * pi / 2)"]
		],
		params: []
	},
	t: {
		description: "PI/4 rotation over Z-axis (synonym for `r4`)",
		matrix: [
			[1,0],
			[0,"exp(i * pi / 4)"]
		],
		params: []
	},
	sdg: {
		description: "(-PI/2) rotation over Z-axis",
		matrix: [
			[1,0],
			[0,"exp(-1i * pi / 2)"]
		],
		params: []
	},
	tdg: {
		description: "(-PI/4) rotation over Z-axis",
		matrix: [
			[1,0],
			[0,"exp(-1i * pi / 4)"]
		],
		params: [],
	},
	swap: {
		description: "Swaps the state of two qubits.",
		matrix: [
			[1,0,0,0],
			[0,0,1,0],
			[0,1,0,0],
			[0,0,0,1]
		],
		params: []
	},
	srswap: {
		description: "Square root of swap",
		matrix: [
			[1,0,0,0],
			[0,"0.5 * (1 + i)","0.5 * (1 - i)",0],
			[0,"0.5 * (1 - i)","0.5 * (1 + i)",0],
			[0,0,0,1]
		],
		params: []
	},
	iswap: {
		description: "Swaps the state of two qubits, applying a -i phase to q1 when it is in the 1 state and a -i phase to q2 when it is in the 0 state",
		matrix: [
			[1,0,0,0],
			[0,0,"0+i",0],
			[0,"0+i",0,0],
			[0,0,0,1]
		],
		params: []
	},
	xy: {
		description: "XY gate",
		matrix: [
			[1, 0, 0, 0],
			[0, "cos(phi / 2)", "1i * sin(phi / 2)", 0],
			[0, "1i * sin(phi / 2)", "cos(phi / 2)", 0],
			[0, 0, 0, 1]
   	],
		params: ["phi"]
	},
	cx: {
		description: "Controlled NOT (CNOT) gate",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,0,1],
			[0,0,1,0]
		],
		params: []
	},
	cy: {
		description: "Controlled Y gate (controlled rotation over Y-axis by PI)",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,0,"-1i"],
			[0,0,"i",0]
		],
		params: []
	},
	cz: {
		description: "Controlled Z gate (controlled rotation over Z-axis by PI)",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,-1]
		],
		params: []
	},
	ch: {
		description: "Controlled Hadamard gate",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,"1 / sqrt(2)","1 / sqrt(2)"],
			[0,0,"1 / sqrt(2)","-1 / sqrt(2)"]
		],
		params: []
	},
	csrn: {
		description: "Controlled square root of NOT",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,"0.5+0.5i","0.5-0.5i"],
			[0,0,"0.5-0.5i","0.5+0.5i"]
		],
		params: []
	},
	ms: {
		description: "Mølmer-Sørensen gate",
		matrix: [
			["cos(theta)", 0, 0, "-i*sin(theta)"],
			[0, "cos(theta)", "-i*sin(theta)", 0],
			[0, "-i*sin(theta)", "cos(theta)", 0],
			["-i*sin(theta)", 0, 0, "cos(theta)"]
		],
		params: ["theta"]
	},
	yy: {
		description: "YY gate",
		matrix: [
			["cos(theta)", 0, 0, "i*sin(theta)"],
			[0, "cos(theta)", "-i*sin(theta)", 0],
			[0, "-i*sin(theta)", "cos(theta)", 0],
			["i*sin(theta)", 0, 0, "cos(theta)"]
		],
		params: ["theta"]
	},
	cr2: {
		description: "Controlled PI/2 rotation over Z-axis",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * pi / 2)"]
		],
		params: []
	},
	cr4: {
		description: "Controlled PI/4 rotation over Z-axis",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * pi / 4)"]
		],
		params: []
	},
	cr8: {
		description: "Controlled PI/8 rotation over Z-axis",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * pi / 8)"]
		],
		params: [],
	},
	crx: {
		description: "Controlled rotation around the X-axis by given angle",
		matrix: [
			[ 1, 0, 0, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, "cos(theta / 2)", "-1i * sin(theta / 2)" ],
			[ 0, 0, "-1i * sin(theta / 2)", "cos(theta / 2)" ]
		],
		params: ["theta"]
	},
	cry: {
		description: "Controlled rotation around the Y-axis by given angle",
		matrix: [
			[ 1, 0, 0, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, "cos(theta / 2)", "-1 * sin(theta / 2)" ],
			[ 0, 0, "sin(theta / 2)", "cos(theta / 2)" ]
  		],
		params: ["theta"]
	},
	crz: {
		description: "Controlled rotation around the Z-axis by given angle (CPHASE)",
		matrix: [
			[1,0,0,0],
			[0,"cos(phi / 2) - i * sin(phi / 2)",0,0],
			[0, 0, 1, 0],
			[0, 0, 0, "cos(phi / 2) + i * sin(phi / 2)"]
		],
		params: ["phi"]
	},
	cu1: {
		description: "Controlled 1-parameter 0-pulse single qubit gate",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * lambda)"]
		],
		params: ["lambda"]
	},
	cu2: {
		description: "Controlled 2-parameter 1-pulse single qubit gate",
		matrix: [
			[ 1, 0, 0, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, "1 / sqrt(2)", "-exp(i * lambda) * 1 / sqrt(2)" ],
			[ 0, 0, "exp(i * phi) * 1 / sqrt(2)", "exp(i * lambda + i * phi) * 1 / sqrt(2)" ]
		],
		params: ["phi", "lambda"]
	},
	cu3: {
		description: "Controlled 3-parameter 2-pulse single qubit gate",
		matrix: [
			[ 1, 0, 0, 0 ],
			[ 0, 1, 0, 0 ],
			[ 0, 0, "cos(theta/2)", "-exp(i * lambda) * sin(theta / 2)" ],
			[ 0, 0, "exp(i * phi) * sin(theta / 2)", "exp(i * lambda + i * phi) * cos(theta / 2)" ]
		],
		params: ["theta", "phi", "lambda"]
	},
	cs: {
		description: "Controlled PI/2 rotation over Z-axis (synonym for `cr2`)",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * pi / 2)"]
		],
		params: []
	},
	ct: {
		description: "Controlled PI/4 rotation over Z-axis (synonym for `cr4`)",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(i * pi / 4)"]
		],
		params: []
	},
	csdg: {
		description: "Controlled (-PI/2) rotation over Z-axis",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(-1i * pi / 2)"]
		],
		params: []
	},
	ctdg: {
		description: "Controlled (-PI/4) rotation over Z-axis",
		matrix: [
			[1,0,0,0],
			[0,1,0,0],
			[0,0,1,0],
			[0,0,0,"exp(-1i * pi / 4)"]
		],
		params: []
	},
	ccx: {
		description: "Toffoli aka \"CCNOT\" gate",
		matrix: [
			[1,0,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0],
			[0,0,0,1,0,0,0,0],
			[0,0,0,0,1,0,0,0],
			[0,0,0,0,0,1,0,0],
			[0,0,0,0,0,0,0,1],
			[0,0,0,0,0,0,1,0]
		],
		params: []
	},
	cswap: {
		description: "Controlled swap aka \"Fredkin\" gate",
		matrix: [
			[1,0,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0],
			[0,0,0,1,0,0,0,0],
			[0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,1,0],
			[0,0,0,0,0,1,0,0],
			[0,0,0,0,0,0,0,1]
		],
		params: []
	},
	csrswap: {
		description: "Controlled square root of swap",
		matrix: [
			[1,0,0,0,0,0,0,0],
			[0,1,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0],
			[0,0,0,1,0,0,0,0],
			[0,0,0,0,1,0,0,0],
			[0,0,0,0,0,"0.5 * (1 + i)","0.5 * (1 - i)",0],
			[0,0,0,0,0,"0.5 * (1 - i)","0.5 * (1 + i)",0],
			[0,0,0,0,0,0,0,1]
		],
		params: []
	},
	reset__: {
		description: "Resets qubit",
		matrix: [],
		params: []
	},
	measure__: {
		description: "Measures qubit and stores chance (0 or 1) into classical bit",
		matrix: [],
		params: []
	}
}
