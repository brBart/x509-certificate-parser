var fs = require('fs');
var x509 = require('x509.js');

var parsedData = x509.parseCert(fs.readFileSync('./cert.cer'));
console.log(parsedData);