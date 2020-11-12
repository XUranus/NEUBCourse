//NEUB lab4
#include <iostream>
#include <cstdio>
#include <string>
#include <vector>
using namespace std;

#define UFD_SIZE 10
#define UFD vector<File>

struct User {
	string username;
	int FDP;//file directory pointer(index to vector to simplify)
	
	User(string _username,int _FDP):
		username(_username),
		FDP(_FDP){}; 
	
	User(){};
};

struct File {
	string filename;
	short protect_code;//(0,1)
	int file_length;
	
	File(string _name,short _code,int _len):
		filename(_name),
		protect_code(_code),
		file_length(_len){};
	
	File(){};
};

struct AFD_item {
	string filename;
	short protect_code;//file open protect code (0,1)
	File* RWP;//read & write pointer
	
	AFD_item(string _name,short _code,File* f):
		filename(_name),
		protect_code(_code),
		RWP(f){};
};

vector<User> MFD;
vector<UFD > UFD_list;
vector<AFD_item> AFD;

string username;
UFD* CUR_UFD;

void init() {
	UFD_list.resize(UFD_SIZE);
	
	User u1("admin",0);
	User u2("Guest1",1);
	User u3("Guest2",2);
	
	MFD.push_back(u1);
	MFD.push_back(u2);
	MFD.push_back(u3);
	
	File f1("movie1.avi",1,104);
	File f2("movie2.rmvb",1,24);
	File f3("movie3.mp4",0,1024);
	File f4("movie4.flv",0,1324);
	File f5("movie5.pmp",1,56);
	File f6("movie6.temp",1,144);
	
	UFD ufd1,ufd2,ufd3;
	ufd1.push_back(f1);
	ufd1.push_back(f2);
	ufd2.push_back(f3);
	ufd2.push_back(f4);
	ufd3.push_back(f5);
	ufd3.push_back(f6);
	
	UFD_list[0] = ufd1;
	UFD_list[0] = ufd1;
	UFD_list[1] = ufd2;
	UFD_list[1] = ufd2;
	UFD_list[2] = ufd3;
	UFD_list[2] = ufd3;	
}

void show_AFD() {
	vector<AFD_item>::iterator iter;
	printf("\033[33m------------------------------------\n\033[0m");
	printf("\033[33m             AFD display\n\033[0m");
	printf("\033[33m------------------------------------\n\033[0m");
	printf("\033[33m      filename    |    RW-PROTECT   \n\033[0m");
	printf("\033[33m------------------------------------\n\033[0m");
	for(iter=AFD.begin();iter!=AFD.end();iter++) {
		 printf("\033[33m%s\t\t%s\t\n\033[0m",iter->filename.c_str(),(iter->protect_code>0?"YES":"NO"));
		printf("\033[33m------------------------------------\n\033[0m");
	}
}

void list(UFD& user_dir) {
	printf("\033[31mFILE_NAME:\t\tPROTECT\t\tFILE_LENGTH\t\tLOGIC_ADDRESS\n\033[0m");
	for(int i=0;i<user_dir.size();i++) {
		File& file = user_dir[i];
		cout << file.filename << "\t\t" << (file.protect_code==1?"YES":"NO") << "\t\t" << file.file_length <<" kb\t\t\t"<< &file <<  endl; 
	}
} 

bool login(string username) {
	bool found_user = false;
	for(int i=0;i<MFD.size();i++) {
		if(MFD[i].username==username) {
			found_user = true;
			CUR_UFD = &UFD_list[i];
			break;
		}
	}
	if(!found_user) {
		cout << "no user named " << username << " found in MFD, login fail."  << endl;
		return false;
	}
	cout << "login success" << endl;
	return true;
}

bool file_in_AFD(File* f) {
	vector<AFD_item>::iterator iter;
	for(iter=AFD.begin();iter!=AFD.end();iter++) {
		if(iter->RWP==f) return true;
	}
	return false;
}

void write(string filename) {
	vector<File>::iterator iter;
	bool found = false;
	for(iter=CUR_UFD->begin();iter!=CUR_UFD->end();iter++) {
		if(iter->filename==filename) {
			found = true;
			if(iter->protect_code) 
			cout << "write file: " << iter->filename << " success";
			else {
				cout << "write file: " << iter->filename << " failed." << endl;
				cout << "Permission denied." << endl;
			}
		}
	} 
	if(!found) cout << "error, file: " << filename << " not exist" << endl;
}

void read(string filename) {
	vector<File>::iterator iter;
	bool found = false;
	for(iter=CUR_UFD->begin();iter!=CUR_UFD->end();iter++) {
		if(iter->filename==filename) {
			found = true;
			if(iter->protect_code) 
			cout << "read file: " << iter->filename << " success";
			else {
				cout << "read file: " << iter->filename << " failed." << endl;
				cout << "read file: " << iter->filename << " failed." << endl;
				cout << "Permission denied." << endl;
			}
		}
	} 
	if(!found) cout << "error, file: " << filename << " not exist" << endl;
}

void open(string filename) {
	if(AFD.size()>=5) {
		cout << "open file: " << filename << " failed." << endl;
		cout << "AFD size limit 5 exceed" << endl; 
	}
	else {
		vector<File>::iterator iter;
		bool found = false;
		for(iter=CUR_UFD->begin();iter!=CUR_UFD->end();iter++) {
			if(iter->filename==filename) {
				found = true;
				if(iter->protect_code) {
					if(file_in_AFD(&*iter)) {
						printf("\033[31mwarining! this file has been opened.\n\033[0m");
					}
					else {
						cout << "open file: " << iter->filename << " success";
						AFD_item it(iter->filename,iter->protect_code,&*iter);
						AFD.push_back(it);
					}
				}
				else {
					cout << "open file: " << iter->filename << " failed." << endl;
					cout << "Permission denied." << endl;
				}
			}
		} 
		if(!found) cout << "error, file: " << filename << " not exist" << endl;
	}
}

void close(string filename) {
	vector<AFD_item>::iterator iter;
	bool found = false;
	for(iter=AFD.begin();iter!=AFD.end();iter++) {
		if(iter->filename==filename) {
			found = true;
			if(iter->protect_code) {
				cout << "close file: " << iter->filename << " success";
				AFD.erase(iter);
			}
			else {
				cout << "close file: " << iter->filename << " failed." << endl;
				cout << "Permission denied." << endl;
			}
		}
	} 
	if(!found) cout << "message: file: " << filename << " not opend" << endl;
}

void create(string filename) {
	cout << "input protect and length: ";
	int length;short code;
	cin >> code >> length;
	File f(filename,code,length);
	if(CUR_UFD->size()>10) {
		cout << "create faile. storage limit 10 exceed." << endl;
	}else {
		CUR_UFD->push_back(f);
		cout << "create success." << endl;
	}
}

void delete_file(string filename) {
	vector<File>::iterator iter;
	bool found = false;
	for(iter=CUR_UFD->begin();iter!=CUR_UFD->end();iter++) {
		if(iter->filename==filename) {
			found = true;
			if(file_in_AFD(&*iter)) {
				cout << "delete file: " << filename << " failed." << endl;
				cout << "file has been open." << endl;
				return;
			}
		}
	}
	cout << "delete file: " << filename << " failed." << endl;
	cout << "no such file." << endl;
}

 
void shell() {
	printf("\033[33m%s$ \033[0m",username.c_str());
	string oper,para;
	cin.clear();
	cin >> oper;
	if(oper=="ls") {
		list(*CUR_UFD);
	}
	else if(oper=="login") {
		cin >> para;
		login(para);
	}
	else if(oper=="create") {
		cin >> para;
		string filename = para;
		create(filename);
	}
	else if(oper=="delete" || oper=="rm") {
		cin >> para;
		string filename = para;
		delete_file(filename);
	}
	else if(oper=="open") {
		cin >> para;
		string filename = para;
		open(filename);
	}
	else if(oper=="close") {
		cin >> para;
		string filename = para;
		close(filename);
	}
	else if(oper=="read") {
		cin >> para;
		string filename = para;
		read(filename);
	}
	else if(oper=="write") {
		cin >> para;
		string filename = para;
		write(filename);
	}
	else if(oper=="exit") {
		cout << "Good bye ~" << endl;
		exit(0);
	}
	else if(oper=="afd"||oper=="AFD") {
		show_AFD();
	}
	else cout << "command not found: " << oper << endl;
	cout << "\n";
}


int main(int argc, char *argv[]) {
	init();
	cout << "file system initialization completed." << endl;
	cout << "input username: ";
	cin >> username;
	while(!login(username)) {
		cout << "input username: ";
		cin >> username;
	}
	//init AFD
	cout << "\n";
	while (true) {
		shell();
	}
}