
// from: https://github.com/davidbkemp/jsqubits/blob/master/examples/algorithms/factoring.js

function factor(number, callback) {
	
    var attempt = 0
    var numOutBits = Math.ceil(Math.log(number) / Math.log(2))
    function attemptFactor() {
        if (attempt++ === 8) {
            callback("failed")
            return
        }
        var randomChoice = 2 + Math.floor(Math.random() * (n - 2))
        log("Step 1: chose random number between 2 and " + n + ".  Chosen: "  + randomChoice)
        var gcd = jsqubitsmath.gcd(randomChoice, n)
        if (gcd > 1) {
            log("Lucky guess.  " + n + " and randomly chosen " + randomChoice + " have a common factor = " + gcd);
            callback(gcd);
            return;
        }
        computeOrder(randomChoice, n, numOutBits, function(r) {
            if (r !== "failed" && r % 2 !== 0) {
                log('Need a period with an even number.  Sadly, ' + r + ' is not even.');
            } else if (r !== "failed" && r % 2 === 0) {
                var powerMod = jsqubitsmath.powerMod(randomChoice, r / 2, n);
                var candidateFactor = jsqubitsmath.gcd(powerMod - 1, n);
                log("Candidate Factor computed from period = " + candidateFactor);
                if(candidateFactor > 1 && n % candidateFactor === 0) {
                    callback(candidateFactor);
                    return;
                }
                log(candidateFactor  + " is not really a factor.");
            }
            log("Try again. (Attempts so far: " + attempt + ")");
            setTimeout(function(){attemptFactor();}, 30)
        });
    }
    if (n % 2 === 0) {
        log("Is even.  No need for any quantum computing!")
        callback(2);
        return;
    }
    var powerFactor = jsqubitsmath.powerFactor(n);
    if (powerFactor > 1) {
        log("Is a power factor.  No need for anything quantum!")
        callback(powerFactor);
        return;
    }
    attemptFactor()
}

function computeOrder(a, n, numOutBits, callback) {
	
    var numInBits = 2 * numOutBits
    var inputRange = Math.pow(2,numInBits)
    var outputRange = Math.pow(2,numOutBits)
    var accuracyRequiredForContinuedFraction = 1/(2 * outputRange * outputRange)
    var outBits = {from: 0, to: numOutBits - 1}
    var inputBits = {from: numOutBits, to: numOutBits + numInBits - 1}
    var attempts = 0
    var bestSoFar = 1
    var f = function(x) { return jsqubitsmath.powerMod(a, x, n);}
    var f0 = f(0)
		
    function determineFrequency(f) {
        var qstate = new jsqubits.QState(numInBits + numOutBits).hadamard(inputBits)
        qstate = qstate.applyFunction(inputBits, outBits, f)
        qstate = qstate.measure(outBits).newState
        return qstate.qft(inputBits).measure(inputBits).result
    }

    function findPeriod() {
			
        if (f(bestSoFar) === f0) {
            log("The period of " + a + "^x mod " + n + " is " + bestSoFar);
            callback(bestSoFar);
            return;
        }
        if (attempts === 2 * numOutBits) {
            log("Giving up trying to find rank of " + a);
            callback("failed");
            return;
        }
        var sample = determineFrequency(f);
        var continuedFraction = jsqubitsmath.continuedFraction(sample/inputRange, accuracyRequiredForContinuedFraction);
        var candidate = continuedFraction.denominator;
        log("Candidate period from quantum fourier transform: " + candidate);
        if (candidate <= 1 || candidate > outputRange) {
            log("Ignoring as candidate is out of range.");
        } else if (f(candidate) === f0) {
            bestSoFar = candidate;
        } else {
            var lcm = jsqubitsmath.lcm(candidate, bestSoFar);
            log("Least common multiple of new candidate and best LCM so far: " + lcm);
            if (lcm > outputRange) {
                log("Ignoring this candidate as the LCM is too large!")
            } else {
                bestSoFar = lcm;
            }
        }
        attempts++;
        log("Least common multiple so far: " + bestSoFar + ". Attempts: " + attempts);
        setTimeout(findPeriod, 50);
    }
    log("Step 2: compute the period of " + a + "^x mod " + n);
    findPeriod()
}

var date = new Date();
factor(35, function(result) {
    log("One of the factors of " + number + " is " + result);
    log("Time taken in seconds: " + ((new Date().getTime()) - date.getTime()) / 1000);
})
