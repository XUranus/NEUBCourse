const httpPort = 8081;
/**********************************************************/

const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const conn = require('./MySQLConfig')();

var server = express();

server.set('trust proxy', 1);
server.set('view engine', 'ejs');
server.engine('ejs', require('express-ejs-extend'))
server.use(cookieSession({
    name:'session',
    keys:['boy ♂ next ♂ door','thank ♂ you ♂ sir','deep ♂ dark ♂ fantasy'],
    maxAge:400*60*100
}));
server.use(cookieParser('Do you like van you ♂ xi'));
server.use(bodyParser.urlencoded({extended:false}))
server.use('/vendor', express.static(__dirname + '/vendor'));
server.use('/dist', express.static(__dirname + '/dist'));

server.get('/login',(req,res)=>{
  res.render('login.ejs',{msg:''});
});

server.use('/user',require('./userRouter')());
server.use('/graph',require('./graphRouter')());
server.use('/park',require('./ParkRouter')());

server.listen(8081);
console.log('Server Starting...port:',httpPort);
