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
  var postRouter = express.Router();

  postRouter.use('/',(req,res,next)=>{
    //统一的身份认证
    if(req.session['user_id']==null) {//没有登陆 返回错误码
      res.status(200).json({msg:'NOT LOGGED'}).end();
      console.log('request url: ',req.originalUrl)
      console.log('access post router not allowed')
    }
    else next();
  });

  postRouter.use('/newPost',(req,res)=>{//写动态
    console.log('new post request: ',req.body);
    var poster_id = req.session['user_id'];
    var text = req.body.content;
    var tag = req.body.tag;
    var href = req.body.href;
    var img = req.body.img;
    var sql = 'insert into post (poster_id,text,tag,href,img) values ('+ poster_id + ',"'+text+'","'+tag+'","'+href+'","'+img+'")';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when create new post',err);
      else res.json({msg:'OK',insertId:data.insertId});
    });
  });

  postRouter.use('/deletePost',(req,res)=>{//删动态
    console.log('delete post request');
    var user_id = req.session['user_id'];
    var post_id = req.body.post_id;
    conn.query('delete from post where post_id = '+post_id+' and poster_id = '+user_id,(err,data)=>{
      if(err) {
        console.log('query sql err when delete post',err);
        res.json({msg:'FAILED'}).end();
      }
      else res.json({msg:'SUCCESS'}).end();
    });
  });

  postRouter.use('/getPosts',(req,res)=>{//获取所有动态
    console.log('get posts request');
    var user_id = req.session['user_id'];
    getPostArr(user_id,(post)=>{
      console.log('send post data:',post);
      res.json({msg:'OK',post:post}).end();
    })
  });

  postRouter.use('/commentToPost',(req,res)=>{
    console.log('request commentToPost');
    var user_id = req.session['user_id'];
    var post_id = req.body.post_id;
    var content = req.body.content;
    var sql = 'insert into comment (commenter_id,post_id,content) values ('+user_id+','+ post_id +',"'+ content +'")';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when comment to post',err);
      else res.json({msg:'OK',insertId:data.insertId}).end();
    });
  });

  postRouter.use('/replyToComment',(req,res)=>{
    console.log('request reply to comment');
    var user_id = req.session['user_id'];
    var comment_id = req.body.comment_id;
    var content = req.body.content;
    var sql = 'insert into reply (replyer_id,comment_id,content) values ('+user_id+','+ comment_id +',"'+ content +'")';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when reply to comment',err);
      else res.json({msg:'OK',insertId:data.insertId}).end();
    });
  });

  postRouter.use('/likeTo',(req,res)=>{
    console.log('request like to');
    var user_id = req.session['user_id'];
    var like_type = req.body.like_type;
    var to_id = req.body.to_id;
    var sql = 'insert into like (user_id,to_id,like_type) values ('+user_id+','+ to_id +',"'+ like_type +'")';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when like to');
      else res.json({msg:'OK',insertId:data.insertId}).end();
    });
  });

  postRouter.use('/cancelLikeTo',(req,res)=>{
    console.log('request cancel like to');
    var user_id = req.session['user_id'];
    var like_type = req.body.like_type;
    var to_id = req.body.to_id;
    var sql = 'delete from like where user_id = '+user_id+' and to_id = '+ to_id +')';
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when cancel like to');
      else res.json({msg:'OK'}).end();
    });
  });


  return postRouter;
}

function getPostArr(user_id,posts) {
  conn.query('select * from post where poster_id='+user_id+' order by id desc',(err,data)=>{
    if(err) console.log('query sql err when getPosts',err);
    else {
      var postArr = [];
      if(data.length==0) posts(postArr);
      for(var i=0;i<data.length;i++) {
        (function(i){
          var user_id = data[i].poster_id;
          var text = data[i].text;
          var href = data[i].href;
          var tag = data[i].tag;
          var img = data[i].img;
          var post_id = data[i].id;
          
          getAvatarById(user_id,(avatar)=>{ //
            getNickNameById(user_id,(nickname)=>{
              getCommentArr(post_id,(comment)=>{
                var post = {post:{id:post_id,nickname:nickname,text:text,href:href,tag:tag,img:img},comment:comment,post_time:convertTime(data[i].time)};
                postArr.push(post);
                if(data.length-1==i) {
                  posts(postArr);
                }
              });
            });
          });
        })(i);  
      }
    }
  });
}

function getCommentArr(post_id,comments) {
  conn.query('select * from comment where post_id = '+post_id,(err,data)=>{
    if(err) console.log('query sql err when getCommentArr',err);
    else {
      var commentArr = [];
      if(data.length==0) comments(commentArr);
      for(var i=0;i<data.length;i++) {
        (function(i){
          var user_id = data[i].commenter_id;
          var comment_id = data[i].id;
          getAvatarById(user_id,(avatar)=>{
            getNickNameById(user_id,(nickname)=>{
              console.log('wxx4',nickname);
              getReplyArr(comment_id,(reply)=>{
                console.log(222);
                var comment = {comment_id:data[i].id,avatar:avatar,nickname:nickname,content:data[i].content,reply:reply};
                commentArr.push(comment);
                if(data.length-1==i) comments(commentArr);
              });
            });
          });
       })(i); 
      }
    }
  });
}

function getReplyArr(comment_id,replys) {
  conn.query('select * from reply where comment_id ='+comment_id,(err,data)=>{
    if(err) console.log('query sql err when getReply',err);
    else {
      var replyArr = [];
      if(data.length==0) replys(replyArr);
      for(var i=0;i<data.length;i++) {
        (function(i){
          var user_id = data[i].replyer_id;
          var content = data[i].content;
          getAvatarById(user_id,(avatar)=>{
            getNickNameById(user_id,(nickname)=>{
              var reply = {reply_id:data[i].id,avatar:avatar,nickname:nickname,content:content};
              replyArr.push(reply);
              if(data.length-1==i) replys(replyArr);
            });
          });
        })(i); 
      }
    }
  })
}



function getAvatarById(user_id,avatar) {
  conn.query('select avatar_path from user where id = '+user_id,(err,data)=>{
    if(err || data[0]==null) {
      console.log('query sql err when get avatar by user id',err);
      avatar(null);
    }
    else avatar(data[0].avatar_path);
  });
}

function getNickNameById(user_id,nickname) {
  conn.query('select nickname from user where id = '+user_id,(err,data)=>{
    if(err || data[0]==null) {
      console.log('query sql err when get nick name by id');
      nickname(null);
    }
    else {
      nickname(data[0].nickname);
    }
  });
}

function convertTime(str) {
  str = str.toString();
  var months = ['empty','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
  var month;
  for(i in months){
    if(months[i] == str.substring(4,7)){
      month = i;
    }
  }
  var res = str.substring(11,15) + '/' + month + '/' + str.substring(8,10) + ' ' + str.substring(16,21);
  return res;
} 