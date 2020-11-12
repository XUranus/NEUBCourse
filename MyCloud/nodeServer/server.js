const express = require('express');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

//全局变量声明
var server = express();
server.set('trust proxy', 1);
//express中间件
server.use(cookieSession({
    name:'session',
    keys:['boy next door','thank you sir','deep dark fantasy'],//不定长数组，每次换不同的密钥进行加密，加大了破解的难度
    maxAge:400*60*1000//200min
}));
server.use(cookieParser('wo ye shi ge guang dong ren'));
server.use(bodyParser.urlencoded({extended:false}));
//允许全局跨域
server.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//用户状态
server.use('/',(req,res,next)=>{
  console.log('------------------------------------');
  if(req.session['user_id']==null)
    console.log('host not logged');
  else
    console.log('host user id: ',req.session['user_id']);
  next();
});
//express路由
server.use('/user/',require('./userRouter')());
server.use('/file/',require('./fileRouter')());
server.use('/friend/',require('./friendRouter')());
server.use('/notification/',require('./notificationRouter')());
server.use('/chat/',require('./chatRouter')());
server.use('/share',require('./shareRouter')());
server.use('/post',require('./postRouter')());

server.listen(8081);
console.log('server starting...');
