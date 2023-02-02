const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require('fs');
const addon01 = require('./UtilsFromPGF/build/Release/AddonForPGF');

// Import dependencies
const ffi = require("ffi-napi");
//var ref = require("ref");

//console.log("###############################################################");
const findPrime = require("./PrimeExample/findPrime");
const findPrimeNative = require("./PrimeExample/build/Release/findprimes");

const input = 10;

let result;

console.time("Native");
result = findPrimeNative(input);
console.timeEnd("Native");
console.log(result);

console.time("JS Find Primes");
result = findPrime(input);
console.timeEnd("JS Find Primes");
console.log(result);

console.log("###############################################################");

// Convert JSString to CString
function TEXT(text) {
  return Buffer.from(`${text}\0`, "ucs2");
}

//Importing Windows DLLs with ffi-napi
// Import user32
const user32 = new ffi.Library("user32", {
  "MessageBoxW": [
      "int32", ["int32", "string", "string", "int32"]
  ],
  "SetCursorPos": [
      "bool", ["int32", "int32"]
  ]
});

//Importing Custom DLLs with ffi-napi
console.log("ARRIVED HERE 01");
var libfactorial = ffi.Library('./libfactorial', {
  'factorial': [ 'uint64', [ 'int' ] ]
});
//Calling Custom DLLs with ffi-napi
console.log("ARRIVED HERE 02");
var output = libfactorial.factorial(5)
console.log('Your output: ' + output)

//Importing Custom DLLs with ffi-napi
var b64cpplib = ffi.Library('b64cpplib', {
  'get_b64_string': [ 'void', [ 'string' ] ]
});
//Calling Custom DLLs with ffi-napi
var buffer = new Buffer.alloc(17.3*1024);
//you can know the size of and img usually in sites like https://codebeautify.org/image-to-base64-converter
b64cpplib.get_b64_string(buffer);
var actualString = buffer.toString('utf-8');
console.log('Your output: ' + actualString.substring(0,30));
// NodeJS has a garbage collector so it is not needed to free memory of the buffer. All of these lines bring errors:
// buffer.clear();
// buffer.fill("0");
// buffer = null;
// buffer.dispose();

console.log("###############################################################");

let window;

let dataToSend = {};

const checkAndSend = () => {
    if (Object.keys(dataToSend).length === 2) {
      window.webContents.send('comparison-event', dataToSend);
      console.log("data was sent");
    }
  };

app.on('ready', () => {
  window = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadFile('index.html');


  setTimeout(function() {
    // // In order to test TRUE or FALSE cases without the addon, invert the comments:
        // /*
        fs.readFile('./rgb_lossless.PGF', (err, data) => {
        if (err) throw err;
        console.log("data A:");
        console.log(data);
        var conv_base64Buffer = addon01.decodePGF(data);
        dataToSend["conv_img"] = conv_base64Buffer;
        checkAndSend();
        });
        // */
        // // uncomment the block just to test FALSE case
        /*
        fs.readFile('./05.bmp', (err, data) => {
            if (err) throw err;
            console.log("data B:");
            console.log(data);
            var og_base64Buffer = data.toString('base64');
            dataToSend["conv_img"] = og_base64Buffer;
            checkAndSend();
        });
        */

        fs.readFile('./rgb_lossless_console_decoded.bmp', (err, data) => {
        if (err) throw err;
        console.log("data C:");
        console.log(data);
        var og_base64Buffer = data.toString('base64');
        dataToSend["og_img"] = og_base64Buffer;
        // // uncomment the line just to test TRUE case
        // dataToSend["conv_img"] = og_base64Buffer;
        checkAndSend();
        });

        //Calling Windows DLLs with ffi-napi
        // Call the message box function
        const OK_or_Cancel = user32.MessageBoxW(
          0, TEXT("Hello from Node.js!"), TEXT("Hello, World!"), 1
        );

        // Show the output of the message box
        console.log(OK_or_Cancel);

        // Set the cursor position
        user32.SetCursorPos(0, 0);
    }, 3000);

});

