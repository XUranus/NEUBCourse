#ifndef _GRAPH_H
#define _GRAPH_H

#include <iostream>
#include <string>
#include <map>
#include <stack>
#include <vector>
#include <set>
#include <algorithm>
#include <fstream>
#include <list>
#include <queue>
using namespace std;

#define INF 999999
#define HamiltonPath pair<queue<string>,double> 


class Edge{
	public:
		
	int from;
	int to;
	double dis;
	
	public:
		
		Edge(int _from,int _to,double _dis) {
			dis = _dis;
			to = _to;
			dis = _dis;
		}
		
};

class Node{
	//景点名称，景点简介，景点欢迎度，有无休息区，有无公厕。
	public:
		
	string name;
	string intro;
	double popularity;
	bool has_rest_area;
	bool has_toilets;
	
	list<Edge> edges;
	
	Node(string _name) {
		name = _name;
		intro = "no introduction";
		popularity = 0;
		has_toilets = false;
		has_rest_area = false;
	}
	
	void add_edge(Edge e) {
		edges.push_back(e);
	}
	
	
};


class Graph {
	public:
	vector<Node> vertices;
	map<string,int> node_index;
	
	public:
		int add_node(string name) { //return index of new node
			Node node(name);
			vertices.push_back(node);
			int index = vertices.size();
			node_index.insert(pair<string,int>(name,index-1));
			//rong cuo duplicate string name
			return index-1;
		}
		
		void add_edge(string name1,string name2,double dis) {//1 -> 2
			int from = name_to_index(name1);
			int to = name_to_index(name2);
			if(from<0 || to<0) {
				cout << name1 << " or " << name2 << " not exists!" << endl;
				exit(1);
			}
			Edge e(from,to,dis);
			vertices[from].add_edge(e);
		}
		
		int name_to_index(string name)  {
			map<string, int>::iterator iter;
			iter = node_index.find(name);
			return iter==node_index.end()?-1:iter->second;
		}
		
		double distance_between(int from,int to) {
			if(from==to) return 0;
			Node& node = vertices[from];
			list<Edge> &edges = node.edges;
			list<Edge>::iterator iter;
			for(iter=edges.begin();iter!=edges.end();iter++) {
				if(iter->to==to) 
				return iter->dis;
			}
			return INF;
		}
		
		
		void display() {//
			cout << "\t";
			for(int i=0;i<vertices.size();i++) 
				cout << vertices[i].name << "\t";
			cout << endl;
			for(int i=0;i<vertices.size();i++) {
				cout << vertices[i].name << "\t";
				for(int j=0;j<vertices.size();j++) {
					cout << distance_between(i,j) << "\t";
				}
				cout << endl;
			}
		}
		
		double shortest_path(string start,string dest) {
			int from = name_to_index(start);
			int to = name_to_index(dest);
			if(from < 0|| to < 0) {
				cout << "达瓦里氏，你很有想法，请跟我去一趟卢比扬卡" << endl;
				return 0;
			}
			else {
				return dijkstra(from,to);
			}
		}
		
		double dijkstra(int start,int to) {
			int maxn = vertices.size();
			double dis[maxn];
			int pre[maxn];
			for(int i=0;i<maxn;i++) dis[i] = INF;
			for(int i=0;i<maxn;i++) pre[i] = -1;
		
			dis[start] = 0;
			
			priority_queue<pair<int,double> > q;
			q.push(pair<int,double>(start,0)); //把起点推入队列
			
			while(!q.empty())
			{
				pair<int,double> p = q.top();
				q.pop();
				int u = p.first; //顶点的编号
				if (dis[u] < p.second) 
					continue;
				
				list<Edge>::iterator iter;
				for(iter = vertices[u].edges.begin();iter != vertices[u].edges.end(); iter++) {
					int v = iter->to;
					double w = iter->dis;
					//cout << "dis["<< v <<"] = " << dis[v] << "  dis["<< u << "]+"<< w << " ="<< dis[u]+w<<endl;;//
					if (dis[v] > dis[u] + w)
					{
						dis[v] = dis[u] + w;
						q.push(pair<int,double>(v,dis[v]));
						pre[v] = u; 
					}
				}
			}
			print_path(start,to,pre);
			return dis[to];
		}
		
		void print_path(int start,int to,int* pre) {
			int u = to;
			stack<int> path;
			path.push(u);
			while(pre[u]!=-1) {
				u = pre[u];
				path.push(u);
				if(u==start) break;
			}
			while(path.size()>1) {
				int u = path.top();
				cout << vertices[u].name << " --> ";
				path.pop();
			}
			int end_u = path.top();
			path.pop();
			cout << vertices[end_u].name << endl;
		}
/************************************************************************************************/
		//HamiltonPath Hamilton(int v,set<int> s);
		//HamiltonPath Hamilton();
		
		void floyd() {
			int n = vertices.size();
			double *maps[n];
			for(int i=0;i<n;i++) maps[i] = new double[n];
			//rebuild graph
			for(int i=0;i<n;i++) {
				for(int j=0;j<n;j++)
				maps[i][j] = distance_between(i,j);
			}
			for(int k=0;k<n;k++)
				for(int i=1;i<n;i++)
					for(int j=1;j<n;j++)
						if(maps[i][k]<INF && maps[k][j]<INF)
							maps[i][j]=min(maps[i][j],maps[i][k]+maps[k][j]);
			/*for(int i=0;i<n;i++) {
				for(int j=0;j<n;j++) cout << maps[i][j] << " ";
				cout << endl;
			}*/
			for(int i=0;i<n;i++) delete maps[i];
		}

};

template<typename T1, typename T2>
bool operator<(const pair<T1, T2> &lhs, const pair<T1, T2> &rhs)
{
	return lhs.second > rhs.second;
}


#endif