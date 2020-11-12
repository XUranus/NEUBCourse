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
  var shareRouter = express.Router();

  shareRouter.use('/',(req,res,next)=>{
  	var user_id = req.session['user_id'];
  	if(user_id==null) {
  		console.log('share Router rejected');
  		return;
  	}
  	else next();
  });

  shareRouter.use('/createShareToken',(req,res)=>{
    console.log('request share token');
  	var user_id = req.session['user_id'];
  	var file_id = req.body.file_id;
    if(!fileBelongsTo(file_id,user_id)) res.json({msg:'Access rejected'}).end();
    else
      conn.query('select * from share where file_id = '+file_id,(err,data)=>{
        if(err) console.log('query sql err when get if file is shared',err);
        else {
          if(data[0]==null) {
            var token = getNewToken(file_id+'boy next door');
            createShare(file_id,token);
            res.json({msg:'SUCCESS',token:token}).end();
          }
          else {
            res.json({msg:'FILE SHARED',token:data[0].token}).end();
          }
        }
      });
  });

  shareRouter.use('/isFileShared',(req,res)=>{
    var user_id = req.session['user_id'];
    if(!fileBelongsTo(file_id,user_id)) {
      res.json({msg:'none of your business'}).end();
    }
  	console.log('query id is file shared');
    var file_id = req.body.file_id;
    conn.query('select token from share where file_id ='+file_id,(err,data)=>{
      if(err) console.log('query sql err at isFileShared');
      else {
        if(data[0]==null) res.json({msg:'NO'}).end();
        else res.json({msg:'YES',token:data[0].token}).end();
      }
    });
  });

  shareRouter.use('/myShareList',(req,res)=>{
    var user_id = req.session['user_id'];
    console.log('request my share list');
    var sql = 'select * from file where id in (select distinct file_id from share,file where file_id in (select id from file where uploader_id = '+ user_id +'))';
    var fileArr = []; var folderArr = [];
    conn.query(sql,(err,data)=>{
      if(err) console.log('query sql err when request my share: ',err)
      else {
          fileArr = data;
          var resData = {msg:'OK',fileArr:fileArr,folderArr:folderArr};
          res.json(resData).end();
      }
    });
  });

  shareRouter.use('/cancelShare',(req,res)=>{
    console.log('cancelShare request file_id = '+file_id);
    var user_id = req.session['user_id'];
    var file_id = req.body.file_id;
    if(!fileBelongsTo(file_id,user_id)) {
      res.json({msg:'Access Rejected'}).end();
      return;
    }
    conn.query('delete from share where file_id = '+file_id,(err,data)=>{
      if(err) console.log('query sql err when cancelShare share',err);
      else res.json({msg:'OK,shared deleted'}).end();
    });
  });

  return shareRouter;
}

function getShareToken(file_id) {
	conn.query('select * from share where file_id = '+file_id,(err,data)=>{
		if(err || data[0]==null) console.log('query sql error when getShareToken',err);
		return data[0].token;
	});
	return null;
}

function createShare(file_id,token) {
	var sql = 'insert into share (file_id,token) values ('+file_id + ',"' + token + '")';
	conn.query(sql,(err,data)=>{
		if(err) console.log('query sql err when create share',err);
		else console.log('create share success',data);
	});
}


function fileBelongsTo(file_id,user_id) {
  //
  return true;
}

function getNewToken(str) {//token
  var res = getHexMd5(str);
  while(isTokenUsed(res)) {
    res = getHexMd5(res);
  }
  return res;

  function isTokenUsed(token_str) {
    conn.query('select * from share where token = "'+token_str+'"',(err,data)=>{
      if(data[0]==null)  return false;
      else return true;
    });
  }

  function getHexMd5(str) {
    var obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');//十六进制表示的字符串
  }
}


