const fs = require('fs');

/*
var names = ["北门","狮子山","仙云石","飞流瀑","仙武湖","九曲桥","花卉园","红叶亭","碧水亭"];
for(var i=0;i<names.length;i++) {
	console.log(`insert into nodes(name,intro,popularity,has_rest_area,has_toilet) values ("${names[i]}","这是有关${names[i]}的介绍",${parseInt(Math.random()*100)},${i%2==0},${i%3==0});`);
}
*/


require('./park.js')(g=>{
	//console.log(g.approximation_TSP());
	//console.log(g);
	//console.log(g.DFS(0));
	/*console.log(g.printAllPaths(4,7));*/
	//console.log(g.accurate_TSP());
})
