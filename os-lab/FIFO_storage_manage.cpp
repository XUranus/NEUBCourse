//NEUB lab3.2
#include <iostream>
#include <stack>
#include <queue>
#include <vector>

using namespace std;
struct page;
queue<page*> memory;

struct page {
	int page_number;
	short flag;
	int main_memory_segment_number;
	short edit_flag;
	int pos;
	
	page(int _pgn,short _flag,short _edit_flag,int mmsn,int _pos):
		page_number(_pgn),
		flag(_flag),
		edit_flag(_edit_flag),
		main_memory_segment_number(mmsn),
		pos(_pos){};
	
	int physic_address(int unit_number) {
		if(flag) {
			return main_memory_segment_number*128 +unit_number;
		}
		else {
			page* p = memory.front();
			cout << "swap out: " << p->page_number << "  swap in: " << page_number << endl;
			memory.pop();
			p->flag = 0;
			p->main_memory_segment_number = -1;
			flag = 1;
			main_memory_segment_number = p->main_memory_segment_number;
			memory.push(this);
			return main_memory_segment_number*128 +unit_number;
		}
	}
};

vector<page> page_table;

struct instruction_sequence {
	string operand;
	int page_number;
	int unit_number;
	
	instruction_sequence(string _oper,int _pn,int _un):
		operand(_oper),
		page_number(_pn),
		unit_number(_un){};
	
	void excute() {
		page& p = page_table[page_number];
		if(operand!="save" && operand!="fetch") {
			p.edit_flag = 1;
		}
		int addr = p.physic_address(unit_number);
		if(addr>0) cout << addr << endl;
	}
};

vector<instruction_sequence> ins_vec;

void load() {
	instruction_sequence in1("+",0,70);
	instruction_sequence in2("+",1,50);
	instruction_sequence in3("*",2,15);
	instruction_sequence in4("save",3,21);
	instruction_sequence in5("fetch",0,56);
	instruction_sequence in6("-",6,40);
	instruction_sequence in7("<<",4,53);
	instruction_sequence in8("+",5,23);
	instruction_sequence in9("save",1,37);
	instruction_sequence in10("fetch",2,78);
	instruction_sequence in11("+",4,1);
	instruction_sequence in12("save",6,84);
	ins_vec.push_back(in1);
	ins_vec.push_back(in2);
	ins_vec.push_back(in3);
	ins_vec.push_back(in4);
	ins_vec.push_back(in5);
	ins_vec.push_back(in6);
	ins_vec.push_back(in7);
	ins_vec.push_back(in8);
	ins_vec.push_back(in9);
	ins_vec.push_back(in10);
	ins_vec.push_back(in11);
	ins_vec.push_back(in12);
	page p1(0,1,5,0,11);
	page p2(1,1,8,0,12);
	page p3(2,1,9,0,13);
	page p4(3,1,1,0,21);
	page p5(4,0,-1,0,22);
	page p6(5,0,-1,0,23);
	page p7(6,0,-1,0,121);
	page_table.push_back(p1);
	page_table.push_back(p2);
	page_table.push_back(p3);
	page_table.push_back(p4);
	page_table.push_back(p5);
	page_table.push_back(p6);
	page_table.push_back(p6);
	memory.push(&page_table[0]);
	memory.push(&page_table[1]);
	memory.push(&page_table[2]);
	memory.push(&page_table[3]);
}

int main(int argc, char *argv[]) {
	load();
	for(int i=0;i<ins_vec.size();i++) {
		ins_vec[i].excute();
	}
}