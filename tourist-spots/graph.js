const Stack = require('stackjs');//https://www.npmjs.com/package/js-priority-queue
const PQueue = require('js-priority-queue');
const fs = require('fs');
const Edge = require('./edge.js');
const Node = require('./node.js');
const Tree = require('./tree.js');
const TreeNode = require('./tree-node.js');
const Permutation = require('get-permutations');
const conn = require('./MySQLConfig')();

const INF = 10000;
function min(a,b) {
	return a<b?a:b;
}

class Graph {
	constructor() {
		this.vertices = [];//vector
		this.edges = [];//adjadency vector
		this.node_index = new Map();//map

		this.undirect_edges = [];
	}

	add_vertice(node_name,intro,popularity,has_rest_area,has_toilet) {
		popularity = parseInt(Math.random()*100);
		var node = new Node(node_name,intro,popularity,has_rest_area,has_toilet);
		this.vertices.push(node);
		this.edges.push([]);
		var index = this.vertices.length -1;
		this.node_index.set(node_name,index);
		return index;
	}

	name_to_index(name) {
		var res = this.node_index.get(name);
		if(res==undefined) return -1;
		else return res;
	}

	add_edge(name1,name2,dis) {//无向图 添加两个方向的
		var from = this.name_to_index(name1);
		var to = this.name_to_index(name2);
		if(to< 0|| from<0) {
			console.log(name1," or ",name2,"not exists!");
			return false;
		}
		this.undirect_edges.push({u:from,v:to,dis:dis});
		var e1 = new Edge(from,to,dis);
		var e2 = new Edge(to,from,dis);
		this.edges[from].push(e1);
		this.edges[to].push(e2);
		return true;
	}

	delete_edge(u,v) {//无向图 删除两个方向的
		for(var i=0;i<this.undirect_edges.length;i++) {
			if(this.undirect_edges[i].u==u || this.undirect_edges[i].v==v) {
				this.undirect_edges.splice(i,1);
				break;
			}
		}//delete edges from undirect_edges
		for(var edges of this.edges) {
			for(var i=0;i<edges.length;i++) {
				if(this.edges[i].u==u || this.edges.v==v) {
					this.edges.splice(i,1);
					break;
				}
			}
		}//delete from this.edges
	}

	distance_between(from,to) {
		if(from==to) return 0;
		var edges = this.edges[from];
		for(var i=0;i<edges.length;i++) {
			if(edges[i].to==to)
				return edges[i].dis;
		}
		return INF;
	}

	display() {
		var str = "\t";
		for(var i=0;i<this.vertices.length;i++)
			str += (this.vertices[i].name + "\t");
		str+="\n";
		for(var i=0;i<this.vertices.length;i++){
			str += (this.vertices[i].name + "\t");
			for(var j=0;j<this.vertices.length;j++) {
				str+=this.distance_between(i,j);
				str+="\t";
			}
			str+="\n";
		}
		console.log("Matrix:\n",str);
	}

	shortest_path(start_name,dest_name) {
		var from = this.name_to_index(start_name);
		var to = this.name_to_index(dest_name);
		if(from<0 || to<0 ){
			console.log("start or dest point not exist!");
			return INF;
		}
		else
			return this.dijkstra(from,to);
	}

	dijkstra(start,to){
		var maxn = this.vertices.length;
		var dis = new Array(maxn);
		var pre = new Array(maxn);
		for(var i=0;i<maxn;i++) dis[i] = INF;
		for(var i=0;i<maxn;i++) pre[i] = -1;

		dis[start] = 0;

		//priority_queue<pair<int,double> > q;
		var q = new PQueue({comparator: function(a, b) { return a.dis - b.dis; }});//{v,dis}
		q.queue({v:start,dis:0}); //把起点推入队列
		while(q.length!=0)//not empty
		{
			var p = q.peek();
			q.dequeue();
			var u = p.v; //顶点的编号
			if (dis[u] < p.dis) {
				continue;
			}

			for(var i=0;i<this.edges[u].length;i++) {
				var v = this.edges[u][i].to;
				var w = this.edges[u][i].dis;
				if (dis[v] > dis[u] + w)
				{
					dis[v] = dis[u] + w;
					q.queue({v:v,dis:dis[v]});
					pre[v] = u;
				}
			}
		}

		var result = {
			start:start,
			to:to,
			dis:dis[to],
			pre:pre
		};
		return result;
	}



	print_path(dijkstra_result){
		var start = dijkstra_result.start;
		var to = dijkstra_result.to;
		var dis = dijkstra_result.dis;
		var pre = dijkstra_result.pre;
		//init
		var str = "";
		var ans = [];
		var u = to;
		var path = new Stack();
		path.push(u);
		while(pre[u]!=-1) {
			u = pre[u];
			path.push(u);
			if(u==start) break;
		}
		while(path.size()>1) {
			var u = path.peek();
			str +=(this.vertices[u].name + " --> ");
			ans.push(this.vertices[u].name);
			path.pop();
		}
		var end_u = path.peek();
		path.pop();
		str += this.vertices[end_u].name + "\n";
		ans.push(this.vertices[end_u].name);
		console.log("Path: ",str);
		return ans;
	}


	floyd() {
		var n = this.vertices.length;
		var maps = new Array(n);
		for(var i=0;i<n;i++)
			maps[i] = new Array(n);
		//rebuild adjadency matrix
		for(var i=0;i<n;i++) {
			for(var j=0;j<n;j++)
				maps[i][j] = this.distance_between(i,j);
		}
		for(var k=0;k<n;k++)
			for(var i=1;i<n;i++)
				for(var j=1;j<n;j++)
					if(maps[i][k]<INF && maps[k][j]<INF)
						maps[i][j]=min(maps[i][j],maps[i][k]+maps[k][j]);
		return maps;
	}


	kruskal() {
		var pre = new Array(this.vertices.length);
		for(var i=0;i<pre.length;i++) pre[i] = i;
		this.undirect_edges.sort(cmp);

		function find(x) {
			var s = x;
			while (x!=pre[x]) {
				x = pre[x];
			}
			pre[s] = x;
			return x;
		}

		function union(x,y) {
			var xr = find(x);
			pre[xr] = y;
			for(var i=0;i<pre.length;i++)
				pre[i] = find(i);
		}

		function cmp(e1,e2){
			if (e1.dis>e2.dis) return 1;
			else if(e1.dis<e2.dis) return -1
			else return 0;
		}

		var min_length = 0,num = 0;
		var ans_path = [];
		for(var i=0;i<this.undirect_edges.length;i++) {
			var u = this.undirect_edges[i].u;
			var v = this.undirect_edges[i].v;
			if(find(u)!=find(v)) {
				min_length += this.undirect_edges[i].dis;
				ans_path.push(this.undirect_edges[i]);
				num++;
				union(u,v);
			}
			if(num>=this.undirect_edges.length-1) break;
		}
		return {
			min_length:min_length,
			ans_path:ans_path
		}
	}

	kruskal_to_tree(kruskal_ans,v) {
		var edges = kruskal_ans.ans_path;
		//
	}

	prim(v) {
		function cmp(e1,e2){
			if (e1.dis>e2.dis) return 1;
			else if(e1.dis<e2.dis) return -1
			else return 0;
		}

		if(v<0||v>=this.vertices.length)
		console.log("start vertice index not correct");
		this.undirect_edges.sort(cmp);
		var edges = this.undirect_edges;
		var ans_set = [];
		var min_length = 0;
		var vis = new Array(this.vertices.length);
		for(var i=0;i<this.vertices.length;i++) vis[i] = 0;
		var S = new Set();
		S.add(v);

		while (S.size!=this.vertices.length) {
			for(var i=0;i<edges.length;i++) {
				if(vis[i]) continue;
				else if(S.has(edges[i].u) && S.has(edges[i].v)) {
					vis[i] = 1;
					continue;
				}else if(!S.has(edges[i].u) && !S.has(edges[i].v)) {
					continue;
				}
				else {
					ans_set.push(edges[i]);
					vis[i] = 1;
					S.add(edges[i].u);
					S.add(edges[i].v);
					min_length+=edges[i].dis;
				}
			}
		}

		return {
			ans_set:ans_set,
			min_length:min_length
		}
	}

	build_tree(v,edges){ //edge{u:u,v:v}
		var vis = new Array(edges.length);
		for(var i=0;i<vis.length;i++) vis[i] = 0;
		function build_child_of(V){
			var v = V.id;
			var ans = [];
			for(var i=0;i<edges.length;i++) {
				if(!vis[i] && (edges[i].u==v || edges[i].v==v)) {
					vis[i] = 1;
					if(edges[i].u==v) V.add_child(edges[i].v);
					else if(edges[i].v==v) V.add_child(edges[i].u);
				}
			}
			for(var i=0;i<V.degree();i++) {
				build_child_of(V.child(i));
			}
		}

		var root = new TreeNode(v);
		build_child_of(root);
		var tree = new Tree(root);
		return tree;
	}

	approximation_TSP() {
		var ans_path_set = [];
		var ans_path_length = [];
		for(var i=0;i<this.vertices.length;i++) {
			//console.log("i=",i);
			var path_set = this.build_tree(i,this.prim(i).ans_set).preOrder();
			ans_path_set.push(path_set);
			var path_length = 0;
			for(var j=0;j<path_set.length-1;j++) {
				path_length+=this.distance_between(path_set[j],path_set[j+1]);
			}
			//console.log(path_set);
			path_length += this.distance_between(path_set[path_set.length-1],path_set[0]);
			ans_path_length.push(path_length);
			//console.log(path_length);
		}
		var ans_path_index = 0,min_path = ans_path_length[0];
		for(var i=0;i<ans_path_length.length;i++) {
			if(ans_path_length[i]<min_path) {
				min_path = ans_path_length[i];
				ans_path_index = i;
			}
		}
		return {
			min_length:min_path,
			path:ans_path_set[ans_path_index]
		}
	}


	DFS(v) {
		var vis = new Array(this.vertices.length);
		var ans = [];
		for(var x of vis) x = 0;
		var graph = this;

		function _DFS(u) {
			console.log('visit:',graph.vertices[u].name);
			ans.push(u);
			vis[u] = 1;
			for(var x of graph.edges[u]) {
				if(!vis[x.to]) _DFS(x.to);
			}
		}

		_DFS(v);
		return ans;
	}

	printAllPaths(s,d) {
		var V = this.vertices.length;
		var graph = this;
	  var visited = new Array(V);
	  var path = new Array(V);
	  var path_index = 0;
		var ans_set = [];
		var str = '';
	  for(var i=0;i<V;i++) visited[i] = false;
		printAllPathsUtil(s, d);
		//console.log(str);
		return ans_set;

		function printAllPathsUtil(u, d) {
				//console.log('printAllPaths:',u,d);
		   	visited[u] = true;
		    path[path_index] = u;
		    path_index++;

		    if (u==d) {
					for(var i = 0; i<path_index; i++)
						str+=(path[i]+" ");
		      str+="\n";
					//
					var t = [];
					for(var i = 0; i<path_index; i++)
						t.push(path[i]);
					ans_set.push(t);
		    }
		    else {
		        for(var i=0;i<graph.edges[u].length;i++) {
								var to = graph.edges[u][i].to;
		            if(!visited[to])
		                printAllPathsUtil(to, d);
						}
		    }
		    path_index--;
		    visited[u] = false;
			}
	}


	accurate_TSP() {
		var ans_set = [];
		var graph = this;

		function calcuLength(path) {
			var len = graph.distance_between(path[path.length-1],path[0]);
			for(var i=0;i<path.length-1;i++) {
				len+=graph.distance_between(path[i],path[i+1]);
			}
			return len;
		}

		for(var x of this.undirect_edges) {
			var path_set = this.printAllPaths(x.u,x.v);
			for(var pArray of path_set) {
				if(pArray.length==this.vertices.length) ans_set.push(pArray);
			}
		}

		var ans = [];
		for(var i=0;i<ans_set.length;i++) {
			ans.push({
				len:calcuLength(ans_set[i]),
				path:ans_set[i]
			});
		}
		return ans;
	}


}

module.exports = function (g) {
  /*fs.readFile('map.txt',(err, data)=>{//   old version
		if(err){
			return console.error(err);
		}
		var graph = new Graph();
		graph.add_vertice("北门");graph.add_vertice("狮子山");graph.add_vertice("仙云石");graph.add_vertice("一线天");
		graph.add_vertice("飞流瀑");graph.add_vertice("仙武湖");graph.add_vertice("九曲桥");graph.add_vertice("观云台");
		graph.add_vertice("花卉园");graph.add_vertice("红叶亭");graph.add_vertice("碧水亭");graph.add_vertice("朝日峰");
		var strArr = data.toString().split("\n");
		for(var i=0;i<strArr.length;i++) {
			if(strArr[i]!='') {
		   		var str = strArr[i].split(" ");
		   		graph.add_edge(str[0],str[1],parseInt(str[2]));
				var u = graph.name_to_index(str[0]);
				var v = graph.name_to_index(str[1]);
				graph.undirect_edges.push({u:u,v:v,dis:parseInt(str[2])});
		   		graph.add_edge(str[1],str[0],parseInt(str[2]));
			}
		}
		return g(graph);
	});*/

	conn.query('select * from nodes',(err,data)=>{ //Load from database
		console.log('Graph nodes initializing...');
		if(err) console.log('graph init error when load nodes');
		var graph = new Graph();
		for(var x of data) {
			graph.add_vertice(x.name,x.intro,x.popularity,x.has_rest_area,x.has_toilet);
		}

		conn.query('select * from edges',(err,data)=>{
			console.log('Graph edges initializing...');
			if(err) console.log('graph init error when load edges');
			for(var e of data) {
				graph.add_edge(e.name1,e.name2,e.dis);
				var u = graph.name_to_index(e.name1);
				var v = graph.name_to_index(e.name2);
			}
			console.log('Graph initialized.');
			return g(graph);
		});
	});

}
