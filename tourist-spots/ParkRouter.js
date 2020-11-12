const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const Stack = require('stackjs');
const Queue = require('jsQueue');
const readline = require('readline');
const conn = require('./MySQLConfig')();

var park = require('./park')(5);

module.exports = function() {
  var parkRouter = express.Router();

  parkRouter.use('/',(req,res,next)=>{
    if(!req.session['user_id'])//not logged
      res.redirect('/');
    else next();
  });


  parkRouter.use('/loadStatus',(req,res)=>{
    var waiting = [];
    var parking = [];
    var temp_queue = new Queue();
		var temp_stack = new Stack();
    //parking:
		while(park.wait_zone.size()!=0) {
			waiting.push(park.wait_zone.peek());
			temp_queue.enqueue(park.wait_zone.peek());
			park.wait_zone.dequeue();
		}
		while(temp_queue.size()!=0) {
			park.wait_zone.enqueue(temp_queue.peek());
			temp_queue.dequeue();
		}
    //waiting:
		while(!park.park_zone.isEmpty()) {
			temp_stack.push(park.park_zone.peek());
			park.park_zone.pop();
		}
		while(!temp_stack.isEmpty()) {
			parking.push(temp_stack.peek());
			park.park_zone.push(temp_stack.peek());
			temp_stack.pop();
		}

    res.json({parking:parking,waiting:waiting}).end();
  });


  parkRouter.use('/parkCar',(req,res)=>{
    var plate_number = req.body.plate_number;
    if(park.park_car(plate_number)) res.json({msg:'OK'}).end();
    else res.json({msg:'FAIL'}).end();
  });


  parkRouter.use('/leftCar',(req,res)=>{
    var plate_number = req.body.plate_number;
    res.json(park.left_car(plate_number)).end();
  });

  parkRouter.use('/loadLog',(req,res)=>{
     conn.query('select * from parkLog',(err,data)=>{
       if(err) console.log('load park log error!',err);
       res.json(data).end();
     });
  });

  return parkRouter;
}
