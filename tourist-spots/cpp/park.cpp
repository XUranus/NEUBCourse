#include <iostream>
#include <stack>
#include <ctime>
#include <queue>
#include <string>
using namespace std;

#define INF 99999
int park_capacity = 5;

struct car {
	time_t arrive_time;
	time_t enter_time;
	string plate_number;
	
	car(time_t _arrive_time,string _plate_num):
		arrive_time(_arrive_time),plate_number(_plate_num) {
			time(&enter_time);
	}
	
	car& operator = (car &c) {
		arrive_time = c.arrive_time;
		enter_time = c.enter_time;
		plate_number = c.plate_number;
		return c;
	}
	
	bool operator == (car& c) {
		return c.plate_number==plate_number;
	}
	
	bool operator != (car& c) {
		return c.plate_number!=plate_number;
	}
	
	void leave() {
		cout << plate_number << "离开了停车场，停车时间: "<< time(0)-enter_time<< "s" << endl;
	}
};


class park{
	public:
	
	stack<car> park_zone;
	queue<car> wait_zone;
	stack<car> temp_zone;
	
	public:
		void park_car(string plate_num,time_t _time) {
			car c(_time,plate_num);
			int status = check(c);
			if(status) {
				return;
				cout << (status==1?"车已经停在车库中了":"车已经停在车道上了") << endl;
			} 
			else {
				if(park_zone.size()>=park_capacity) {
					c.enter_time = time(0);
					wait_zone.push(c);
					cout << c.plate_number << "车停入了等待区，位置 W：";
					cout << wait_zone.size() << endl;
				}
				else {
					c.enter_time = time(0);
					park_zone.push(c);
					c.arrive_time = time(0);
					cout << c.plate_number << " 车停入了停车场，位置 P：";
					cout << park_zone.size() << endl;
				}
				display();//
			}
		}
		
		void park_car(string plate_num) {
			park_car(plate_num,time(0));
			
		}
		
		int check(car &c) { //return whether car has arrived
			stack<car> pz = park_zone;
			queue<car> wz = wait_zone;
			while (!pz.empty()) {
				if(pz.top()==c) {
					//cout << "车已经停在车库中了" << endl;
					return 1;
				}
				pz.pop();
			}
			while (!wz.empty()) {
				if(wz.front()==c) {
					//cout << "车已经停在车道上了" << endl;
					return 2;
				}
				wz.pop();
			}
			return 0;
		}
		
		void left_car(string plate_num) {
			left_car(plate_num,time(0));
		}
		
		
		void left_car(string plate_num,time_t _time) {
			car c(_time,plate_num);
			int status = check(c);
			switch (status) {
				case 0://not in
					cout << "这辆车还没来" << endl;
					break;
				case 2://in waiting zone
					cout << "不支持等待区离开" << endl;
					break;
				case 1://in park zone
					while (park_zone.top()!=c) {
						temp_zone.push(park_zone.top());
						park_zone.pop();
					}
					
					park_zone.top().leave();
					park_zone.pop();
					
					while (!temp_zone.empty()) {
						park_zone.push(temp_zone.top());
						temp_zone.pop();
					}
					
					if(wait_zone.size()>0) {
						wait_zone.front().enter_time = time(0);
						park_zone.push(wait_zone.front());
						wait_zone.pop();
					}
					display();//
					break;
			}
		}
		
		void display() {
			queue<car> wz = wait_zone;
			stack<car> pz = park_zone;
			
			cout << "停车场状态： " << endl ;
			int i=1;
			while (!pz.empty()) {
				cout << "["<< i++ << "]" << pz.top().plate_number << " ";
				pz.pop();
			}
			i=1;
			cout << "\n等待区状态： " << endl ;
			while (!wz.empty()) {
				cout << "["<< i++ << "]" << wz.front().plate_number << " ";
				wz.pop();
			}
			cout << endl;
		}

};

int main(int argc, char *argv[]) {
	park p;
	
	for(int i=0;i<5;i++) {
		string c;
		cin >> c;
		p.park_car(c);
	}
	for(int i=0;i<3;i++) {
		string c;
		cin >> c;
		p.left_car(c);
	}
	

	
	return 0;
}
