const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = require('./MySQLConfig')();

var json = {};

module.exports = function() {
  var userRouter = express.Router();

  userRouter.post('/login',(req,res)=>{
    var mail = req.body.mail;
    var password = req.body.password;

    console.log("login request: ",req.body);
    var sql = 'select * from User where mail = "'+mail+'" and password = "'+password+'"';
    conn.query(sql,(err,data)=>{
      if(err)
        console.log('fail to query sql when login',err);
      else {
        if(data[0]==null) {
          res.render('login.ejs',{msg:'用户名或者密码错误'});
          console.log('authentic failed');
        }
        else {
          //init session info
          req.session['user_id'] = data[0].id;
          req.session['user_group'] = data[0].user_group;
          req.session['username'] = data[0].nickname;
          req.session['mail'] = data[0].mail;

          res.redirect('/user/main');
          console.log('log success');
        }
      }
    });
  });


  userRouter.use('/',(req,res,next)=>{
    if(!req.session['user_id'])//not logged
      res.redirect('/');
    else next();
  });

  userRouter.use('/main',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('main.ejs',json);
  });

  userRouter.use('/showGraph',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('showGraph.ejs',json);
  });

  userRouter.use('/searchNode',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('searchNode.ejs',json);
  });

  userRouter.use('/createGraph',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('createGraph.ejs',json);
  });

  userRouter.use('/shortestPath',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('shortestPath.ejs',json);
  });

  userRouter.use('/guidePath',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('guidePath.ejs',json);
  });

  userRouter.use('/parkRegister',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('parkRegister.ejs',json);
  });

  userRouter.use('/parkRegisterLog',(req,res)=>{
    json = {
      username:req.session['username'],
      userType:req.session['user_group']
    }
    res.render('parkRegisterLog.ejs',json);
  });

  return userRouter;
}
