//'use strict'

var appOutput = 'xdotool'; // both == output to both xdotool & wensockets
//var localSerialPort = '/dev/ttyACM0'; // R: bluetooth == rfcomm0 if only one device connected ;)
var localSerialPort = '/dev/rfcomm0'; // R: bluetooth == rfcomm0 if only one device connected ;)

// stdin to be able to easily debug stuff that'd normally be sent from the Espruino UART
var stdin = process.openStdin();

// to be able to use xdotool if installed & wanted
//var exec = require('child_process').exec; // nice to have anyway ( and should NOT cause troubles .. I think ? )
var XdotoolHelper = require('./XdotoolHelper');
var xdotoolHelper = new XdotoolHelper();
//xdotoolHelper.testXdotoolMouse(); // debug test: move x+10,y+10 - works

/**/
// serial port part
//var sp = require('serialport');
//var SerialPort = sp.SerialPort;
//var parsers = sp.parsers;
var Readline = require('@serialport/parser-readline');
var SerialPort = require('serialport'); // worked fine
//const SerialPort = require('serialport');
//var parsers = SerialPort.parsers;
/**/
//var serialport = require('serialport');
//var SerialPort = serialport.SerialPort;

// http handling & fs
var http = require('http');
var fs = require('fs');

// server inject.html
var server = http.createServer(function(req, res) {
  fs.readFile('./inject.html', 'utf-8', function(error, content) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(content);
  });
});

// debug helper
var logLetters = function(letterChunk){
  var arr = letterChunk.split('');
  arr.forEach(function(letter, idx){
    console.log('letter chunk ' + idx + ': ' + letter);
  })
}

// multi-outputs capable helper
var sendToOutputs = function(data){
  if(appOutput === 'both'){
    xdotoolHelper.handleSerialInput( data.toString().trim() ); // forward to xdotool
    sendInputToWs( data.toString().trim() ); // forward to websocket
  } else if(appOutput === 'xdotool'){
    xdotoolHelper.handleSerialInput( data.toString().trim() ); // forward to xdotool
  } else if(appOutput === 'websockets'){
    sendInputToWs( data.toString().trim() ); // forward to websocket
  }
}

// helper
var sendInputToWs = function(data){
  console.log('data.length: ' + data.length); // 29 when typed on cli, 32 when received from serial ? => INVESTIGATE !
  /*
  ws:{"wsmouse.send":[3,0,0,0]} => yup, 29 ?! -> so which invisible chars is it ?
  */
  //logLetters(data);
  if(data.substr(0, 3) === '[J') { // /!\ there's a hidden char within the string as 1st position !
    console.log('hidden character found & stripped at beginning of data: presumably coming from Espruino/serial');
    data = data.substr(3);
    console.log('fixed data: ' + data);
  }
  // seems the above is not bullet-proof, so trying another way ( until I finally decide to try using JSON.stringify on the uC end ? .. )
  var data = data.substr( data.indexOf('ws:') );
  console.log('sendInputToWs: sending ' + data);

  // directly send over ws to client ( we could also have parsed the data here & use xdotool to have sys-wide stuff )
  if( theClient !== undefined && data.substr(0,3) === 'ws:' ){ // forward only websocket stuff, not all the stuff printed on serial console
     console.log('  .. forwarding message as wsmessage ..');
     theClient.emit('wsmessage', data.substr(3) ); // forward any serial data to websockets as 'message' evt
  } else if( data.substr(0,3) !== 'ws:' ){
    console.log('  .. data doesn\'t start with "ws"');
  }
}

/**/
// serial port

var port = new SerialPort(localSerialPort, {
  baudRate: 115200, //9600,
  //parser: parsers.readline('\r\n')
});

// Open the port
/*
var port = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});
*/
var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
//var parser = port.pipe(new Readline({ delimiter: '\n' }));
//var parser = port.pipe(new Readline({ delimiter: '\r' }));
port.on('open', function(){
  console.log('serialport connected');
});
/*
port.on('data', function(data){
  //console.log('serialport data:' + data);
  console.log('SerialPort Data:' + data);
  //sendInputToWs(data); // forward to websocket
});
*/
/*
// Switches the port into "flowing mode" - somehow worked but glitched output ?
port.on('data', function (data) {
    console.log('Data:', data);
});
// Read data that is available but keep the stream from entering "flowing mode" - worked fine
port.on('readable', function () {
    console.log('Data:', port.read());
});
*/
// Read the port data
port.on("open", function () {
    console.log('serialport open');
    /*
    port.on('data', function(data) {
        console.log(data);
    });
    */
    parser.on('data', function(data){
      //console.log(data);
      //sendInputToWs( data.toString().trim() ); // forward to websocket
      sendToOutputs(data);
    });
});
/**/
//parser.on('data', console.log)
/*
parser.on('data', function(data){
  console.log('SerialPort Data: [' + data + ']');
});
*/
/**/


// stdin
stdin.addListener("data", function(data) {
  console.log("you entered: [" + data.toString().trim() + "]");
  //port.write( data.toString().trim() + '\r\n' ); // test-write to port .. works fine !
  //sendInputToWs( data.toString().trim() ); // forward to websocket
  //xdotoolHelper.handleSerialInput( data.toString().trim() ); // forward to xdotool
  sendToOutputs(data);
});


// websockets
var io = require('socket.io').listen(server);

var theClient = undefined;
io.sockets.on('connection', function (socket, pseudo) {
    // store socket
    theClient = socket;

    // send msg on connect
    socket.emit('message', 'Connected');
    // signal other clients there's a newcomer
    socket.broadcast.emit('message', 'Another client just connected');

    // store given stuff in session variable
    socket.on('stuff', function(stuff) {
        socket.stuff = stuff;
    });

    // receiving stuff
    socket.on('message', function (message) {
      // get stuff from session variable
      console.log(socket.stuff + ' logs : ' + message);
    });
});


server.listen(8080);
console.log('listening on 8080 ..');

/*
// AFTER launching server, handle cli realtime input
// stdin to be able to easily debug stuff that'd normally be sent from the Espruino UART
var stdin = process.openStdin();

stdin.addListener("data", function(data) {
  console.log("you entered: [" + data.toString().trim() + "]");
  sendInputToWs(data); // forward to websocket
});
*/
