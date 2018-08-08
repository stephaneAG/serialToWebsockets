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

// websockets
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
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
