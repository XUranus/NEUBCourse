#include <iostream>
#include <string>
#include <algorithm>
#include <cstdio>
#include <list>
#include <vector>
using namespace std;

enum STATUS {
	finish = 1,
	working = 2,
	ready = 3
};

struct process {
	string process_name;
	int need_time;
	int cpu_time;
	int priority;
	STATUS status;
	bool started;
	
	process(
		string _name,
		int _need_time,
		int _cpu_time,
		int _priority,
		STATUS _status
	):
		process_name(_name),
		need_time(_need_time),
		cpu_time(_cpu_time),
		priority(_priority),
		status(_status){
			started = false;
		}
		
	friend ostream& operator << (ostream& os,const process& p) {
		os << p.process_name << "\t" << p.cpu_time << "\t\t" << p.need_time << "\t\t" << p.priority << "\t\t" ;
		switch (p.status) {
			case 1:
				os << "finish";
				break;
			case 2:
				os << "working";
				break;
			case 3:
				os << "ready";
				break;
			default:
				break;
		}
		return os;
	}
	
};

bool operator < (const process& p1,const process& p2) {
	if(p1.status!=p2.status) {
		return p1.status > p2.status;
	}
	else {
		return p1.priority > p2.priority;
	}
}

vector<process*> pcb_monitor;
list<process> pcb_list;
int cpu_time = 1;

void display_status() {
	cout << "NAME\tCPUTIME\t\tNEEDTIME\tPRIORITY\tSTATE" << endl;
	for(int i=0;i<pcb_monitor.size();i++) {
		process &p = *pcb_monitor[i];
		if(p.status==working) {
			printf("\033[32m%s\t%d\t\t%d\t\t%d\t\tworking  \n\033[0m",p.process_name.c_str(),p.cpu_time,p.need_time,p.priority);	
		}
		else cout << *pcb_monitor[i] << endl;
	}
	cout << endl;
}

void excute() {
	cout << "CPUTIME:" << cpu_time << endl;
	process& p = *pcb_list.begin();
	p.priority--;
	p.need_time--;
	p.status = working;
	p.started = true;
	
	list<process>::iterator itor; 
	itor = pcb_list.begin();
	while(itor!=pcb_list.end()) {
		process &p = *itor;
		if(p.status!=finish && p.started) p.cpu_time++;
		itor++;
	}
	
	cpu_time++;
	display_status();
	
	if(p.need_time==0) {
		p.status = finish;
		pcb_list.sort();
	}
	else {
		pcb_list.sort();
		p.status = ready;
	}
}

int main(int argc, char *argv[]) {
	process p1("P1",2,0,1,ready);
	process p2("P2",3,0,5,ready);
	process p3("P3",1,0,3,ready);
	process p4("P4",2,0,4,ready);
	process p5("P5",4,0,2,ready);

	pcb_list.push_back(p1);
	pcb_list.push_back(p2);
	pcb_list.push_back(p3);
	pcb_list.push_back(p4);
	pcb_list.push_back(p5);;
	
	list<process>::iterator itor; 
	itor = pcb_list.begin();
	while(itor!=pcb_list.end()) {
		pcb_monitor.push_back(&*itor);
		itor++;
	}
	
	cout << "CPUTIME:" << 0 << endl;
	display_status();
	pcb_list.sort();
	//init
	
	while ((*pcb_list.begin()).status!=finish) {
		excute();
	};
	//excute
	
	cout << "CPUTIME:" << cpu_time << endl;
	display_status();
	//stop
	
	return 0;
}