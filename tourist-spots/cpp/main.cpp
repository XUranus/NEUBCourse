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

using namespace std;

Graph *graph = NULL;

void display_graph() {
	graph->display();
}



void show_menu() {
	cin.clear();
	system("clear");
	for(int i=0;i<40;i++) 
	printf("\033[33m=\033[0m");
	printf("\n          欢迎使用景区信息管理系统\n");
	printf("\t    ****请选择菜单****\n");
	for(int i=0;i<40;i++) 
	printf("\033[33m=\033[0m");
	printf("\n1.创建景区景点分布图。\n");
	printf("2.输出景区景点分布图。\n");
	printf("3.输出导游线路图\n");
	printf("4.输出导游线路图中的回路\n");
	printf("5.求两个景点间的最短路径\n");
	printf("6.输出道路修建规划图\n");
	printf("7.停车场车辆进出记录信息。\n");
	printf("0.退出系统\n");
	int choice = -1;
	cin >> choice;//=0
	cin.clear();
	char t;
	switch (choice) {
		case 0:
			cout << "退出成功" << endl;
			break;
		case 1:
			graph = load_graph();
			cout << "\n生成成功\n"  << endl;
			cin.get();
			show_menu();
			break;
		case 2:
			if(graph==NULL) {
				cout << "尚未生成旅游景点图" << endl;
				//
				show_menu();
			}
			display_graph();
			cin.get();
			show_menu();
			break;
		case 3:
			cout << "not support" << endl;
			break;
		case 4:
			cout << "not support" << endl;
			break;
		case 5:
			{
				if(graph==NULL) {
					cout << "尚未生成旅游景点图" << endl;
					//
					show_menu();
				}
				string name1,name2;
				cin >> name1 >> name2;
				cout << graph->shortest_path(name1,name2) << endl;
				//
				show_menu();
				break;	
			}
		case 6:
			cout << "not support" << endl;
			break;
		case 7:
			cout << "not support" << endl;
			break;
		default:
			cout << "错误，重新选择" << endl;
			cin >> t;
			cin.clear();
			system("clear");
			show_menu();
			break;
	}
	system("clear");
}


int main() {
	show_menu();
	
	
	//Graph graph = load_graph();
	//graph.display();
	
	//cout << graph.shortest_path("仙云石","飞流瀑") << endl;
	//cout << graph.shortest_path("仙云石","仙云石") << endl;
	//cout << graph.shortest_path("仙云石","北门") << endl;
	//graph.floyd();
	
	/*for(int i=0;i<graph.vertices.size();i++) {
		cout << "{ data: { id: '" << graph.vertices[i].name << "', foo: 2, bar: 5, baz: 7 } }," <<endl;
	}*/

	//{ data: { id: '北门', foo: 2, bar: 5, baz: 7 } 
}



