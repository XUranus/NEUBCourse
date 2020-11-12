const express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const pathObj = require('path');
const fs = require('fs');
const crypto = require('crypto');
const conn = require('./mysqlConnectionConfig')();

module.exports = function() {
  var chatRouter = express.Router();

  chatRouter.use('/',(req,res,next)=>{
  	var user_id = req.session['user_id'];
  	if(user_id==null) {
  		console.log('chat router rejectes');
  		return;
  	}
  	else next();
  });

  chatRouter.use('/sendChatMessage',(req,res)=>{
  	console.log('send chat sendChatMessage',req.body);
  	var receiver_id = req.body.receiver_id;
  	var message = req.body.message;
  	var sender_id = req.session['user_id'];
  	conn.query('insert into chatMessage (sender_id,receiver_id,message) values ('+sender_id+','+receiver_id+',"'+message+'")',(err,data)=>{
  		if(err) console.log('query sql err when send chat message',err);
  		res.json({msg:'OK'}).end()
  	});
  });

  chatRouter.use('/loadChatHistory',(req,res)=>{
  	console.log('load chat message',req.body);
  	var sender_id = req.body.friend_id;
  	var receiver_id = req.session['user_id'];
  	var sql1 = 'select message,time from chatMessage where sender_id ='+sender_id+' and receiver_id ='+receiver_id;
  	var sql2 = 'select message,time from chatMessage where sender_id ='+receiver_id+' and receiver_id ='+sender_id;
  	conn.query(sql1,(err,data1)=>{
  		if(err) console.log('query sql err when load chat history(1)',err);
  		else 
  			conn.query(sql2,(err,data2)=>{
  				if(err) console.log('query sql err when load chat history(2)',err);
  				else console.log('chat history send:',{data1:data1,data2:data2});
  				res.json({data1:data1,data2:data2}).end();
  			});
  	});
  });

  return chatRouter;
}