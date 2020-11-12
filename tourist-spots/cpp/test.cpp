#include <iostream>

using namespace std;

#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <set>
#include <algorithm>
#include <fstream>
#include <list>
#include <cstdio>
#include <set>
#include "Graph.h"
#include "util.h"

/*
HamiltonPath Graph::Hamilton() {
	
	
}

set<int> erase_verice(set<int> ss) {
	//delete iter->first from ss
	set<int>::iterator it;
	for (it=ss.begin(); it!=ss.end(); it++) {
		if(it->first==iter->first) {
			ss.erase(it++);
			return ss;
		}
		else
			it++;
	}
}

HamiltonPath Graph::Hamilton(int v,set<int> s) {
	set<int>::iterator iter;
	vector<HamiltonPath> ans_vec;
	
	for(iter=s.begin();iter!=s.end();iter++) {
		if(distance_between(v,*iter)>=INF) {
			s = erase_verice(*iter);
			iter = s.begin();
		}//
		Hamilton(*iter,ss)+distance_between(v,iter->first)
	}
	
}*/
int tot_node;
int m_size[50];
int mmap[50][50];
int vis[50];
int ans[50];
int cas = 1;
int n,m;
 
Graph *graph = load_graph();

void dfs(int m,int len,int c)
{
	int i,j;
	vis[m] = 1;
	ans[len] = m;
	for(i = 0; i<m_size[i]; i++)
	{
		int t = mmap[m][i];
		if(t == c && len == tot_node)
		{
			printf("%d:  ",cas++);
			for(j = 0; j<tot_node; j++)
				printf("%d ",ans[j]);
			printf("%d\n",c);
		}
		if(!vis[t])
			dfs(t,len+1,c);
	}
	vis[m] = 0;
}


int main(int argc, char *argv[]) {
	tot_node = graph->vertices.size();
	for(int i=0;i<graph->vertices.size();i++) {
		list<Edge> &e = graph->vertices[i].edges;
		list<Edge>::iterator it;
		int k=0;
		for(it=e.begin();it!=e.end();it++) mmap[i][k++]=it->to;
		m_size[i] = k;
	}
	//
	for(int i=0;i<graph->vertices.size();i++) {
		cout << i << ": ";
		for(int j=0;j<m_size[i];j++) {
			cout << mmap[i][j] <<  " ";
		}
		cout << endl;
	}
	//
	for(int i=0;i<graph->vertices.size();i++) {
		memset(vis,0,sizeof(vis));
		dfs(i,0,i);
	}
}

