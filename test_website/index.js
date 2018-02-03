var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//resources server
app.use(express.static(__dirname + '/www'));

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log('Server running on port %s', port);
});

var players = []; //list of all the players on the server

io.on('connection', function(socket) {
    console.log('user connected');
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});