var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

//resources server
app.use(express.static(__dirname + '/www'));

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log('Server running on port %s', port);
});

io.on('connection', function(socket) {
    console.log('user connected');
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
	
	socket.on('user_register',function(msg){
		var files = fs.readdirSync('/kiss/users/');
		var exists = false;
		for(var i = 0; i < files.length; i++)
		{
			if(files[i] == msg.username)exists = true;
		}
		socket.emit('register_response',exists);
		if(!exists)
		{
			msg.goals = [];
			msg.friends = [];
			fs.writeFile("/kiss/users/"+msg.username, JSON.stringify(msg));
		}
	});
	
	socket.on('add_goal', function(msg){
		var contents;
		var currentID;
		var jsonp;
		console
		fs.readFile("current_index","utf-8",function(err,contents){
			if(err)throw err;
			jsonp = JSON.parse(contents);
			currentID = jsonp.value;
			currentID++;
			jsonp.value = currentID;		
			fs.writeFile("/kiss/goals/"+currentID+".goal", JSON.stringify(msg));
			var oldf;
			fs.readFile("/kiss/users/"+msg.username,"utf-8",function(err,oldf){
				if(err)throw err;
			    oldf = JSON.parse(oldf);
				oldf.goals.push(currentID);
				fs.writeFile("/kiss/users/"+msg.username,JSON.stringify(oldf));
				fs.writeFile("current_index",JSON.stringify(jsonp), function(err){if(err)throw err;});
			});
		});
	});
	
	//receives username
	socket.on('get_user_goals',function(msg){
		var user;
		fs.readFile("/kiss/users/"+msg.username,"utf-8",function(err,user){
			user = JSON.parse(user);
			var goals_list = [];
			for(var i = 0; i < user.goals.length; i++)
			{
				var goalID = user.goals[i];
				var gl;
				fs.readFile("/kiss/goals/"+goalID+".goal","utf-8",function(err,gl){
					goals_list.push(JSON.parse(gl));
				});
			}
			socket.emit("return_user_goals",goals_list);
		});
	});
	
	//receives goal ID {"id" : 1000}
	socket.on('get_goal_from_id',function(msg){
		var goalInfo;
		fs.readFile("/kiss/goals/"+msg.ID,"utf-8",function(err,goalInfo){
			socket.emit('return_goal',JSON.parse(goalInfo));
		});
	});
	
	//receives username {'username' : 'ex_username'}
	socket.on('get_user_from_username',function(msg){
		var userInfo;
		fs.readFile("/kiss/users/"+msg.username,"utf-8",function(err,userInfo){
			socket.emit('return_user',JSON.parse(goalInfo));
		});	
	});
		
	
});