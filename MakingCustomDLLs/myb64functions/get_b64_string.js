var ffi = require('../../')

var myb64lib = ffi.Library('myb64lib', {
  'get_b64_string': [ 'void', [ 'string' ] ]
});

// var buffer = new Buffer(32); // allocate 32 bytes for the output data, an imaginary MD5 hex string.
// var buffer = new Buffer.alloc(32);
var buffer = new Buffer.alloc(17.3*1024);
//you can know the size of and img usually in sites like https://codebeautify.org/image-to-base64-converter

myb64lib.get_b64_string(buffer);

// var actualString = ref.readCString(buffer, 0);
var actualString = buffer.toString('utf-8');
console.log('Your output: ' + actualString);