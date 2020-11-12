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
  var notificationRouter = express.Router();

  notificationRouter.use('/',(req,res,next)=>{
  	var user_id = req.session['user_id'];
  	if(user_id==null) {
  		console.log('notification router rejected');
  		return;
  	}
  	else next();
  });

  notificationRouter.use('/getNotifications',(req,res)=>{ //同步通知消息
  	var user_id = req.session['user_id'];
  	var sql = 'select * from notification where receiver_id = ' + user_id +' and not readed';
  	conn.query(sql,(err,data)=>{
  		if(err) console.log();
  		else {
  			console.log('notifications sent: ',data);
  			res.json(data).end();
  		}
  	});
  });

  notificationRouter.use('/getMessages',(req,res)=>{ //同步通知消息
  	var user_id = req.session['user_id'];
  	var sql = 'select * from message where receiver_id = ' + user_id +' and not readed';
  	conn.query(sql,(err,data)=>{
  		if(err) console.log();
  		else {
  			console.log('messages sent: ',data);
  			res.json(data).end();
  		}
  	});
  });

  notificationRouter.use('/confirmNotification',(req,res)=>{ //确认通知 （隐藏通知）
  	console.log('confirmNotification request',req.body);
  	ReadedNotification(req.body.notification_id);
  	res.json({msg:'OK'}).end();
  });

  notificationRouter.use('/confirmMessage',(req,res)=>{ //确认消息 （隐藏通知）
  	console.log('confirm messages request',req.body);
  	ReadedMessage(req.body.message_id);
  	res.json({msg:'OK'}).end();
  });

  return notificationRouter;
}

function ReadedNotification(notification_id) {
  	var sql = 'update notification set readed = true where id= '+notification_id;
    conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when readed notification');
    });
}

function ReadedMessage(message_id) {
  	var sql = 'update message set readed = true where id= '+message_id;
    conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when readed message');
    });
}