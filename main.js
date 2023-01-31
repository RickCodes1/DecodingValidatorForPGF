const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require('fs');
const addon01 = require('./UtilsFromPGF/build/Release/AddonForPGF');

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
    }, 3000);

});

