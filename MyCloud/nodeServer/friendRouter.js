const express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const pathObj = require('path');
const fs = require('fs');
const crypto = require('crypto');
//const conn = mysql.createPool({host:'localhost',user:'root',password:'password',database:'MyCloud',multipleStatements:true});
const conn = require('./mysqlConnectionConfig')();

module.exports = function() {
  var friendRouter = express.Router();

  friendRouter.use('/',(req,res,next)=>{
    //统一的身份认证
    if(req.session['user_id']==null) {//没有登陆 返回错误码
      res.status(200).json({msg:'NOT LOGGED'}).end();
      console.log('request url: ',req.originalUrl)
      console.log('access friend router not allowed')
    }
    else next();
  });

  friendRouter.use('/searchNewFriend',(req,res)=>{//根据搜索的关键字
  	console.log('search new friend request');
    var input = req.body.input;//关键字
    var user_id = req.session['user_id'];
    var sql = "select id,nickname,avatar_path,mail from user where (mail='" + input + "' or nickname like '%"+ input +"%') and ( id not in "
    + " (select id from user where id = "+ user_id +")) and (id not in (select user_id from friendship where user_id = "+ user_id +"))";
    console.log(sql);
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when search new friend',err);
      else res.json({data:data}).end();
    });
  });

  friendRouter.use('/addFriend',(req,res)=>{//添加好友请求
    var friend_id = req.body.userID;
    console.log('add friend request, friend id = ',friend_id);
    var my_id = req.session['user_id'];
    conn.query('select nickname,avatar_path,mail from user where id = '+ my_id,(err,data)=>{
    	if(err) console.log('quey sql err when add friend',err);
      var info = {act:'ADD FRIENDSHIP REQUEST',applyer:data[0]};
      var sender_id = req.session['user_id'];
      sendNotification(sender_id,friend_id,info);
      res.json({msg:'OK'}).end();
    });
  });

  friendRouter.use('/deleteFriend',(req,res)=>{//删除好友请求
    var friend_id = req.body.friend_id;
    var user_id = req.session['user_id'];
    conn.query("delete from friendship where (user_id = "+ user_id +" and friend_id = "+friend_id+") or (user_id = "+friend_id+" and friend_id = "+user_id+")",(err,data)=>{
      if(err) console.log('query sql err when delete friendship',err);
      else res.json({msg:'OK'}).end();
    });
  });

  friendRouter.use('/acceptFriend',(req,res)=>{//接受添加好友请求
    var friend_id = req.body.friend_id;
    var notification_id = req.body.notification_id;
    var user_id = req.session['user_id'];
    console.log('accept friend request:',req.body);
    conn.query('select nickname from user where id = '+ user_id,(err,data)=>{
      if(err) console.log('query sql err when accept friend',err);
      var info = {act:'ACCEPT FRIENDSHIP REQUEST',accepter:data[0],notification_id:req.body.notification_id};
      addFriendship(user_id,friend_id);
      addFriendship(friend_id,user_id);
      sendNotification(user_id,friend_id,info);
      res.json({msg:'OK'}).end();
    });
  });

  friendRouter.use('/declineFriend',(req,res)=>{//拒绝添加好友请求
    var friend_id = req.body.friend_id;
    var notification_id = req.body.notification_id;
    var user_id = req.session['user_id'];
    console.log('decline friend request:',req.body);
    conn.query('select nickname from user where id = '+ user_id,(err,data)=>{
      if(err) console.log('query sql err when decline friend',err);
      var info = {act:'DECLINE FRIENDSHIP REQUEST',accepter:data[0],notification_id:req.body.notification_id};
      sendNotification(user_id,friend_id,info);
      res.json({msg:'OK'}).end();
    });
  });

  friendRouter.use('/friendInfo',(req,res)=>{//获取好友个人信息
    var friend_id = req.body.id;
    console.log('request friendInfo id = ',friend_id);
    conn.query("select * nickname,mail,self_intruction from user where id = ${friend_id}",(err,data)=>{
      if(err) console.log('query sql err when get friendInfo');
      else res.json({msg:'OK',data:data[0]}).end();
    });
  });

  friendRouter.use('/friendList',(req,res)=>{//查操作 获取好友列表
    var user_id = req.session['user_id'];
    console.log('request friend list');
    var sql = "select nickname,avatar_path,mail,id from user where id in (select distinct friend_id from friendship where user_id = "+user_id+")";
    conn.query(sql,(err,data)=>{//返回好友的id集合
      if(err) console.log('query sql err when request friend list',err);
      else {
        res.json(data).end();
        console.log(data[0]);
      }
    });
  });

  return friendRouter;
}

function sendNotification(sender_id,receiver_id,info) {//消息派送
  switch (info.act) {
    case 'ADD FRIENDSHIP REQUEST'://通知 有人添加你好友
      var content = {};
      content.type = info.act;
      content.title = '好友请求';
      content.text = info.applyer.nickname+' 想添加你为好友';
      content.applyer_id = info.applyer.id;
      var sql = 'insert into notification (sender_id,receiver_id,content) values (' + sender_id +',' + receiver_id +',\''+ JSON.stringify(content) +'\')';
      conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when create Notification',err);
        else console.log('notification sent',content);
      });
      break;
    case 'DECLINE FRIENDSHIP REQUEST'://
      var content = {};
      content.type = info.act;
      content.title = '好友请求被拒绝';
      content.text = info.accepter.nickname+' 拒绝了你的好友请求';
      var sql = 'insert into notification (sender_id,receiver_id,content) values (' + sender_id +',' + receiver_id +',\''+ JSON.stringify(content) +'\')';
      conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when create Notification',err);
        else console.log('notification sent',content);
      });
      deleteNotification(info.notification_id);
      break;
    case 'ACCEPT FRIENDSHIP REQUEST'://info {accepter:data[0],notification_id:req.body.notification_id};
      var content = {};
      content.type = info.act;
      content.title = '好友请求通过';
      content.text = info.accepter.nickname+' 通过了你的好友请求';
      var sql = 'insert into notification (sender_id,receiver_id,content) values (' + sender_id +',' + receiver_id +',\''+ JSON.stringify(content) +'\')';
      conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when create Notification',err);
        else console.log('notification sent',content);
      });
      deleteNotification(info.notification_id);
      break;
    default:
      break;
  }

}

function deleteNotification(notification_id) {
  	var sql = 'update notification set readed = true where id= '+notification_id;
    conn.query(sql,(err,data)=>{
        if(err) console.log('query sql error when ACCEPT FRIENDSHIP REQUEST');
    });
}

function addFriendship(user_id,friend_id) {
	conn.query('insert into friendship (user_id,friend_id) values ('+ user_id +','+ friend_id +')',(err,data)=>{
		if(err) console.log('query sql err when addFriendship');
	});
}