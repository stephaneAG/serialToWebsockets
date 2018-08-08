// serial port part
var sp = require('serialport');
var Sp = sp.SerialPort;
var parsers = sp.parsers;

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

// serial port
port.on('open', function(){
  console.log('serialport connected');
});
port.on('data', function(data){
  console.log('serialport data:' + data);
    
  // directly send over ws to client ( we could also have parsed the data here & use xdotool to have sys-wide stuff )
  if( theClient !== undefined && data.substr(0,3) === 'ws:' ){ // forward only websocket stuff, not all the stuff printed on serial console
     socket.emit('message', data.substr(3) ); // forward any serial data to websockets as 'message' evt 
  }
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
