/*var http = require('http'),
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
});*/

var express = require('express'),
	path = require('path'),
	io = require('socket.io'),
	fs = require('fs'),
	lineReader = require('line-reader');
var app = express();
app.set("view engine","ejs");

var history = [];

app.get('/chatroom',function(req, res){
	//res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
	lineReader.eachLine(path.join(__dirname,'/log/chatLog.txt'), function(line, last) {
		  history.push(line);
	}).then(function(){
		res.render(path.join(__dirname,'index'),{
			history : history.splice(history.length - 5, 5)
		});		
	});

	/*fs.createReadStream(path.normalize(path.join(__dirname,'server.html')),{
		'flags' : 'r',
		'encoding' : 'binary',
		'mode' : 0666,
		'bufferSize' : 4 * 1024
	}).addListener('data',function(chunk){
		res.write(chunk,'binary');
	}).addListener('end',function(){
		res.end();
	});*/
});

var server = app.listen(8878, function(){
	console.log('Listen at http://localhost:8878');
});

var sio = io.listen(server);
sio.sockets.on('connection',function(client){
	client.on('message',function(user, msg){
		var date = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
		var str = user + '说：' + msg + '  ' + date;
		console.log(str);
		fs.appendFile(path.join(__dirname,'/log/chatLog.txt'),str+'\r\n','utf8',function(err){
			if(err){
				console.log(err);
			}
		});
		client.broadcast.emit('user message', user, msg);
	});
	client.on('disconnect', function(){
		console.log("server has disconnect.");
	});
});

var formatDate = function(date, format){
    var res = format, tt = '';
    res = res.replace(/yyyy|yy/, function($0) {
        if($0.length === 4) {
            return date.getFullYear();
        } else {
            return (date.getFullYear() + '').slice(2, 4);
        }
    }).replace(/MM|M/, function($0) {
        if($0.length === 2 && date.getMonth() < 9) {
            return '0' + (date.getMonth() + 1);
        } else {
            return date.getMonth() + 1;
        }
    }).replace(/dd|d/, function($0) {
        if($0.length === 2 && date.getDate() < 10) {
            return '0' + date.getDate();
        } else {
            return date.getDate();
        }
    }).replace(/HH|H/, function($0) {
        if($0.length === 2 && date.getHours() < 10) {
            return '0' + date.getHours();
        } else {
            return date.getHours();
        }
    }).replace(/hh|h/, function($0) {
        var hours = date.getHours();
        if(hours > 11) {
            tt = 'PM';
        } else {
            tt = 'AM';
        }
        hours = hours > 12 ? hours - 12 : hours;
        if($0.length === 2 && hours < 10) {
            return '0' + hours;
        } else {
            return hours;
        }
    }).replace(/mm/, function($0) {
        if(date.getMinutes() < 10) {
            return '0' + date.getMinutes();
        } else {
            return date.getMinutes();
        }
    }).replace(/ss/, function($0) {
        if(date.getSeconds() < 10) {
            return '0' + date.getSeconds();
        } else {
            return date.getSeconds();
        }
    }).replace('tt', tt);
    return res;
};