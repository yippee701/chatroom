/*var express = require('express'),
	path = require('path'),
	io = require('socket.io'),
	fs = require('fs');
var app = express();

app.get('/chatroom',function(req, res){
	res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
	fs.createReadStream(path.normalize(path.join(__dirname,'server.html')),{
		'flags' : 'r',
		'encoding' : 'binary',
		'mode' : 0666,
		'bufferSize' : 4 * 1024
	}).addListener('data',function(chunk){
		res.write(chunk,'binary');
	}).addListener('end',function(){
		res.end();
	});
});

var server = app.listen(8878, function(){
	console.log('Listen at http://localhost:8878');
});

var sio = io.listen(server);
var writeFile = fs.createWriteStream(path.join(__dirname,'chatLogs.txt'), {
	encoding: 'utf8', 
	flag: 'a'
});	
sio.sockets.on('connection',function(client){
	console.log('!!');
	client.on('message',function(user, msg){
		//console.log(client);
		var str = user + '说：' + msg;
		console.log(str);
		writeFile.write(str + '\n');
		client.broadcast.emit('user message', user, msg);
	});
	client.on('disconnect', function(){
		writeFile.end();
		console.log("server has disconnect.");
	});
});*/


var http = require('http'),
	io = require('socket.io'),
	path = require('path'),
	fs = require('fs');
var server = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
	fs.createReadStream(path.normalize(path.join(__dirname,'server.html')),{
		'flags' : 'r',
		'encoding' : 'binary',
		'mode' : 0666,
		'bufferSize' : 4 * 1024
	}).addListener('data',function(chunk){
		res.write(chunk,'binary');
	}).addListener('end',function(){
		res.end();
	});
	console.log('Listen at http://localhost:8878');
}).listen(8878);

/*var writeFile = fs.createWriteStream(path.join(__dirname,'chatLog.txt'), {
	encoding: 'utf8', 
	flag: 'a+'
});	*/


io.listen(server).on('connection',function(client){
	client.on('message',function(user, msg){
		var str = user + '说：' + msg;
		console.log(str);
		fs.appendFile(path.join(__dirname,'/log/chatLog.txt'),str+'\r\n','utf8',function(err){
			if(err){
				console.log(err);
			}
		});
		client.broadcast.emit('user message', user, msg);
	});
	client.on('disconnect', function(){
		//writeFile.end();
		console.log("server has disconnect.");
	});
});
