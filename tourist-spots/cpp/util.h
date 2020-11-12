#ifndef _UTIL_H
#define _UTIL_H


#include <iostream>
#include "Graph.h"
using namespace std;

Graph* load_graph() {
	Graph* graph = new Graph();
	
	graph->add_node("北门");
	graph->add_node("狮子山");
	graph->add_node("仙云石");
	graph->add_node("一线天");
	graph->add_node("飞流瀑");
	graph->add_node("仙武湖");
	graph->add_node("九曲桥");
	graph->add_node("观云台");
	graph->add_node("花卉园");
	graph->add_node("红叶亭");
	graph->add_node("碧水亭");
	graph->add_node("朝日峰");
	
	ifstream fin("map.txt");
	string name1,name2;
	int dis;
	while (fin >> name1 >> name2 >> dis) {
		graph->add_edge(name1,name2,dis);
		graph->add_edge(name2,name1,dis);
		
		//cout << "{ data: { id: '"<< (name1+name2) << "', weight: "<<dis<<", source: '"<<name1<<"', target: '"<<name2<<"' } }," << endl;
		//{ data: { id: 'ae', weight: 1, source: 'a', target: 'e' } },
	}
	
	return graph;
}

#endif