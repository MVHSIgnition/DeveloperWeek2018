var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var ipdict = {};


//resources server
app.use(express.static(__dirname + '/www'));

server.listen(process.env.PORT || 1266, function() {
    var port = server.address().port;
    console.log('Server running on port %s', port);
});

io.on('connection', function(socket) {
    console.log('user connected');
    var address = socket.request.connection.remoteAddress;
	if(!(address in ipdict))ipdict[address] = '';
	//else console.log(ipdict[address]);
	
	
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
			msg.bets = []; //goal ids, amount
			msg.balance = 100;
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
			msg.bets = []; //username, amount
			msg.pctcomplete = 0.0;
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
		var user = msg;
		if(fs.readdirSync("/kiss/users/").indexOf(user) >= 0)fs.readFile("/kiss/users/"+msg.username,"utf-8",function(err,user){
			user = JSON.parse(user);
			var goals_list = [];
			for(var i = 0; i < user.goals.length; i++)
			{
				var goalID = user.goals[i];
				var gl;
				fs.readFile("/kiss/goals/"+goalID+".goal","utf-8",function(err,gl){
					goals_list.push(JSON.parse(gl));
					//console.log(goals_list);
				});
			}
			setTimeout(function(){
				socket.emit("return_user_goals",goals_list);
			},500);
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
		if(fs.readdirSync("/kiss/users/").indexOf(msg.username) >= 0)fs.readFile("/kiss/users/"+msg.username,"utf-8",function(err,userInfo){
			socket.emit('return_user',JSON.parse(userInfo));
		});	
	});
	
	socket.on('get_username',function(msg){
		//console.log(ipdict[address]);
		socket.emit('return_username', ipdict[address]);
	});
	
	//receives an object of username and password
	socket.on('log_in',function(msg){
		var pass = msg.password;
		var user = msg.username;
		
		if(fs.readdirSync("/kiss/users/").indexOf(user) >= 0)fs.readFile("/kiss/users/"+user,"utf-8",function(err,userInfo){
			userInfo = JSON.parse(userInfo);
			if(pass == userInfo.password){
				socket.emit('return_login_status',{"success" : true});
				ipdict[address] = user;
			}
			else socket.emit('return_login_status',{"success" : false});
		});
	});
	
	socket.on('log_out',function(msg){
		ipdict[address] = "";
	});
	
	//username, friendusername
	socket.on('add_friend', function(msg){
		var user   = msg.username;
		var friend = msg.friendusername;
		
		if(fs.readdirSync("/kiss/users").indexOf(friend) >= 0)fs.readFile("/kiss/users/"+user,"utf-8",function(err,userInfo){
			userInfo = JSON.parse(userInfo);
			userInfo.friends.push(friend);
			fs.writeFile("/kiss/users/"+user, JSON.stringify(userInfo));
			socket.emit("friend_result",{"result" : true});
		});
		else socket.emit("friend_result",{"result" : false});
	});
	
	//socket (goal owner, index, username, amount)
	socket.on('add_bet_to_goal',function(msg){
		var better = msg.username;
		var owner  = msg.goalowner;
		var index  = msg.indes;
		var amount = parseInt(msg.amount);
		console.log(msg);
		var goalID;
		
		fs.readFile("/kiss/users/"+owner,"utf-8",function(err,userInfo){
			userInfo = JSON.parse(userInfo);
			//console.log(userInfo);	
			//console.log(userInfo.password);
			goalID = userInfo.goals[index];
			fs.readFile("/kiss/users/"+better,"utf-8",function(err,subInfo){
				subInfo = JSON.parse(subInfo);
				subInfo.balance -= amount;
				subInfo.bets.push({"goalID":goalID,"amount":amount});
				fs.writeFile("/kiss/users/"+better,JSON.stringify(subInfo));
				fs.readFile("/kiss/goals/"+goalID+".goal","utf-8",function(err,goalInfo){
					goalInfo = JSON.parse(goalInfo);
					goalInfo.bets.push({"username" : better, "amount" : amount});
					fs.writeFile("/kiss/goals/"+goalID+".goal",JSON.stringify(goalInfo));
				});
			});
		});
		
	});
	
	//username
	socket.on('get_friends_from_user', function(msg){
		var user = msg.username;
		console.log("e");
		if(fs.readdirSync("/kiss/users").indexOf(user))fs.readFile("/kiss/users/"+user,"utf-8",function(err,userInfo){
			userInfo = JSON.parse(userInfo);
			var friendlist = [];
			
			for(var i = 0; i < userInfo.friends.length; i++)
			{
				fs.readFile("/kiss/users/"+userInfo.friends[i],"utf-8",function(err,subInfo){
					subInfo = JSON.parse(subInfo);
					friendlist.push(subInfo);
				});
			}
			setTimeout(function(){
				console.log(friendlist);
				socket.emit("return_user_friends",friendlist);
			},500);
		});
	});
		
	
});