const express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
//全局常量ss
const default_capacity = 1024; //MB
const default_credit = 0;
const conn = require('./mysqlConnectionConfig')();

module.exports = function() {
  var userRouter = express.Router();
  //路由 /user/...

  userRouter.get('/info',(req,res)=>{
  	//返回用户信息的接口
    if(req.session['user_id']==null) {//没有登陆 返回错误码
      res.status(200).json({msg:'NOT LOGGED'}).end();
      console.log('request user info not allowed')
    }
    else {
      var sql = 'select nickname,mail from user where id = 1';
    	console.log('SQL excuting: ',sql);
    	conn.query(sql,(err,data)=>{
    		if(err) {
    			console.log('fail ',err);
    			res.write('{msg:"network error"}');
    			res.end();
    		}
    		else{
    			console.log('sent user info success ',data[0]);
    			res.send(data).end();
    		}
    	});
    }
  });



  userRouter.post('/register',(req,res)=>{
  	console.log('register request: ',req.body);
  	var sql = 'insert into user (password,mail,nickname,credit,capacity,avatar_path,status,used) values ("'+req.body.password+'","'+req.body.mail+'","'+req.body.nickname+'",'+default_credit+','+default_capacity+',"img/default_avatar.png","normal",JSON_OBJECT("video",0,"image",0,"document",0,"music",0))';
  	conn.query(sql,(err,data)=>{
  		if(err) {
  			console.log('query sql err when register',err);
        res.status(200).json({msg:'邮箱已被占用'}).end();
      }
  		else {
        req.session['user_id'] = data.insertId;
        req.session['current_path'] = 'MyCloud';
        res.status(200).json({msg:'OK'}).end();
        console.log('register success');
      }
  	});
  });



  userRouter.post('/login',(req,res)=>{//登陆
    //读取sql数据 返回状态 赋予cookies,session
    var mail = req.body.mail;
    var password = req.body.password;
    console.log("login request: ",req.body);
    var sql = 'select * from user where mail = "'+mail+'" and password = "'+password+'"';
    conn.query(sql,(err,data)=>{
      if(err) //失败 输出调试信息
        console.log('fail to query sql when login',err);
      else {
        if(data[0]==null) {
          res.send({Msg:"用户名或者密码错误"}).end();
          console.log('authentic failed');
        }
        else {
          if(data[0].status!="normal") {
            res.send({Msg:"该账号已被封禁"}).end();
            console.log('this account has been banned');
          }
          else {//登陆成功 追加session
            req.session['user_id'] = data[0].id;
            req.session['current_path'] = 'MyCloud';
            console.log('log permission sent');
            res.send({Msg:"OK"}).end();
          }
        }
      }
    });
  });



  userRouter.post('/saveInfo',(req,res)=>{//用户信息修改
    console.log('update user info request: ',req.body);
    if(req.session['user_id']==null) {//没有登陆 返回错误码
      res.status(200).json({msg:'NOT LOGGED'}).end();
      console.log('update user info not allowed')
    }
    else {
      var user_id = req.session['user_id'];
      var sql = 'update user set '+
      'self_intruction = "'+req.body.self_intruction+'", '+
      'gender = "'+req.body.gender+'", '+
      'tel = "'+req.body.tel+'", '+
      'tag = "'+req.body.tag+'", '+
      'age = '+req.body.age+', '+
      'qq = "'+req.body.qq+'" '+
      ' where id = '+user_id;
      console.log(sql);// deleteble
      conn.query(sql,(err,data)=>{
        if(err) {
          res.json({msg:'服务器错误'}).end();
          console.log('query sql err when update person detail info: ',err)
        }
        else {
          res.json({msg:'OK'}).end();
          console.log('update user info success');
        }
      })
    }
  });

  userRouter.use('/saveAvatarSrc',(req,res)=>{
  	var avatar_src = req.body.src;
  	console.log('save avatar request：',avatar_src);
  	var user_id = req.session['user_id'];
  	conn.query('update user set avatar_path = "'+ avatar_src +'" where id = ' + user_id,(err,data)=>{
  		if(err) console.log('query sql err when update avatar src',err);
  		else {
  			console.log('save success');
  			res.json({msg:'OK',avatar_path:avatar_src}).end();
  		}
  	});
  });

  userRouter.use('/getUsage',(req,res)=>{
  	// image document music video free left
  	console.log('require usage');
  	var user_id = req.session['user_id'];
  	conn.query('select catagory,SUM(size) from file where uploader_id = '+ user_id +' group by catagory',(err,data)=>{
  		if(err) console.log('query sql err when get usage',err);
  		else {
  			var usage = data;
  			console.log(usage);
  			res.json(usage).end();
  		}
  	});
  });

  userRouter.use('/getMyInfo',(req,res)=>{
  	var user_id = req.session['user_id'];
  	console.log('request my info ,my id is：' + user_id);
  	conn.query('select nickname,capacity,self_intruction,tag,qq,tel,age,avatar_path from user where id = ' + user_id,(err,data)=>{
  		if(err) console.log('query sql err when get my info',err);
  		else {
  			res.json(data[0]).end();
  			console.log(data[0]);
  		}
  	});
  });

  userRouter.use('/getCapacity',(req,res)=>{
  	var user_id = req.session['user_id'];
  	console.log('get capacity request');
  	var sql = 'select capacity from user where id = '+ user_id;
  	conn.query(sql,(err,data)=>{
  		var capacity = data[0].capacity/1024;//MB
  		if(err) console.log(err);
  		else conn.query('select SUM(size) from file where uploader_id = '+user_id,(err,data)=>{
  			if(err) console.log(err);
  			var used_capacity = data[0]["SUM(size)"]*1.0/1024/1024;
  			console.log('total = ',capacity,'GB ,used = '+ used_capacity+' GB');
  			res.json({used:used_capacity,capacity:capacity}).end();
  		});
  	});
 })

  return userRouter;
};
