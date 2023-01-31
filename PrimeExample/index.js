const findPrime = require("./Z_PrimeExample/findPrime")
const findPrimeNative = require("./Z_PrimeExample/build/Release/findprimes")

const input = 10

let result

console.time("Native")
result = findPrimeNative(input)
console.timeEnd("Native")
console.log(result)

console.time("JS Find Primes")
result = findPrime(input)
console.timeEnd("JS Find Primes")
console.log(result)