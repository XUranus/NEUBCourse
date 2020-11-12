const socketPort = 8082;
/*****************************************************/

const express = require('express');
const fs = require('fs');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const Edge = require('./edge');
const conn = require('./MySQLConfig')();

var graph;
require('./graph')(g=>{//init
  graph = g;
});

var io = require('socket.io')(socketPort);
console.log('Socket listening...port:',socketPort);
io.on('connection', function (socket) {
  //
});

module.exports = function() {
  var graphRouter = express.Router();

  graphRouter.use('/',(req,res,next)=>{
    if(!req.session['user_id'])//not logged
      res.redirect('/');
    else next();
  });


  graphRouter.use('/loadGraph',(req,res)=>{
    var nodes = [];
    var edges = [];
    for(var i=0;i<graph.vertices.length;i++) {
      nodes.push({id:i,label:graph.vertices[i].name,title:graph.vertices[i].intro});
    }
    for(var i=0;i<graph.undirect_edges.length;i++) {
      edges.push({
        from:graph.undirect_edges[i].u,
        to:graph.undirect_edges[i].v,
        label:graph.undirect_edges[i].dis+''
      });
    }
    //console.log("send edges",edges);
    res.json({edges:edges,nodes:nodes}).end();
  });

  graphRouter.use('/shortestPath',(req,res)=>{
    var name1 = req.body.name1;
    var name2 = req.body.name2;
    var result = graph.shortest_path(name1,name2);
    var path = graph.print_path(result);
    res.json({path:path,length:result.dis}).end();
  });

  graphRouter.use('/getAllNodes',(req,res)=>{
    res.json(graph.vertices).end();
  });

  graphRouter.use('/addVertice',(req,res)=>{
    //vertice{name}
    var name = req.body.name;
    graph.add_vertice(name);
    res.json({}).end();
  });


  graphRouter.use('/getTSPPath',(req,res)=>{
    res.json(graph.accurate_TSP()).end();
  });

  graphRouter.use('/addEdge',(req,res)=>{
    var from = req.body.from;
    var to = req.body.to;
    var dis = req.body.dis;
    graph.undirect_edges.push({u:from,v:to,dis:dis});
    var e1 = new Edge(from,to,dis);
    var e2 = new Edge(to,from,dis);
    graph.edges[from].push(e1);
    graph.edges[to].push(e2);
    io.sockets.emit('notification', { msg: '景点路径已更新！' });
    res.json({msg:true}).end();
  });


  return graphRouter;
}
