const Stack = require('stackjs');
const Queue = require('jsQueue');
const readline = require('readline');
const conn = require('./MySQLConfig')();


class car {
	constructor(arrive_time,plate_number) {
		this.arrive_time = arrive_time;
		this.plate_number = plate_number;
		this.enter_time = null;
		this.leave_time = null;
	}

	copy() {
		var c = new car(this.arrive_time,this.plate_number);
		return c;
	}

	equals(car) {
		return (this.plate_number == car.plate_number);
	}

	leave() {
		this.leave_time = (new Date()).valueOf();
		console.log(this.plate_number,"leaved.");
		var cost = this.leave_time-this.enter_time;
		console.log("cost time: ",cost);
		conn.query(`insert into parkLog (plate_number,arrive_time,enter_time,leave_time,cost) values ("${this.plate_number}",${this.arrive_time},${this.enter_time},${this.leave_time},${cost})`,(err,data)=>{
			if(err) console.log('save log err:',err);
		});
		return cost;
	}
}

class park {
	constructor(park_capacity) {
		this.park_capacity = park_capacity;

		this.park_zone = new Stack();
		this.wait_zone = new Queue();
		this.temp_zone = new Stack();
	}

	park_car(plate_number) {
		var c = new car((new Date()).valueOf(),plate_number);
		var status = this.check_status(c);
		if(status<0) {
			if(status == -1) console.log("操作失败，车已经停在车道上了");
			else if(status == -2) console.log("操作失败，车已经停在车库中了");
			return false;
		}
		else {
			if(this.park_zone.size()>=this.park_capacity) {
				c.enter_time = (new Date()).valueOf();
				this.wait_zone.enqueue(c);
				console.log("操作成功,",c.plate_number,",车停入了等待区，位置 W:",this.wait_zone.size()-1);
			}
			else {
				c.enter_time = (new Date()).valueOf();
				this.park_zone.push(c);
				c.arrive_time = (new Date()).valueOf();
				console.log("操作成功,",c.plate_number,"车停入了停车场，位置 P:",this.park_zone.size()-1);
			}
			//this.display();//
			return true;
		}
	}


	stack_has_element(stack,element) {//whether the stack has the element(car)
		var temp_stack = new Stack();
		var ans = false;
		while(!stack.isEmpty()) {
			var t = stack.peek();
			if(t.equals(element)) {
				ans = true;
				break;
			}
			stack.pop();
			temp_stack.push(t);
		}
		while(!temp_stack.isEmpty()) {
			stack.push(temp_stack.peek());
			temp_stack.pop();
		}
		return ans;
	}


	queue_has_element(queue,element) {//whether the queue has the element(car)
		var temp_queue = new Queue();
		var ans = false;
		while(queue.size()!=0) {
			var t = queue.peek();
			if(t.equals(element)) {
				ans = true;
				break;
			}
			queue.dequeue();
			temp_queue.enqueue(t);
		}
		while(temp_queue.size()!=0) {
			queue.enqueue(temp_queue.peek());
			temp_queue.dequeue();
		}
		return ans;
	}


	check_status(c) {
		/*
		return -1:车已经停在车道上等待了
		return -2:车已经停在车库中了
		return  0:车已经离开或者还没到
		*/
		var ts = new Stack();
		if(this.queue_has_element(this.wait_zone,c)) {
			console.log("车已经停在车道上等待了");
			return -1;
		}
		else if(this.stack_has_element(this.park_zone,c)){
			console.log("车已经停在车库中了");
			return -2;
		}
		else return 0;
	}

	left_car(plate_number) {
		var time_now = (new Date()).valueOf();
		var c = new car(time_now,plate_number);
		var status = this.check_status(c);
		switch (status) {
			case 0://not in
				console.log("这辆车还没来");
				return {
					res:false,
					msg:'这辆车还没来'
				}
				break;
			case -1://in waiting zone
				console.log("不支持等待区离开");
				return {
					res:false,
					msg:'不支持等待区离开'
				}
				break;
			case -2://in park zon
				while (!this.park_zone.peek().equals(c)) {
					this.temp_zone.push(this.park_zone.peek());
					this.park_zone.pop();
				}

				var cost = this.park_zone.peek().leave();
				this.park_zone.pop();

				while (!this.temp_zone.isEmpty()) {
					this.park_zone.push(this.temp_zone.peek());
					this.temp_zone.pop();
				}

				if(this.wait_zone.size()!=0) {
					this.wait_zone.peek().enter_time = (new Date()).valueOf();
					this.park_zone.push(this.wait_zone.peek());
					this.wait_zone.dequeue();
				}
				//display();//
				return {
					res:true,
					cost:cost
				}
				break;
			default:
				console.log("car_status_err!");
				exit(1);
				break;
		}
	}

	display() {
		var temp_queue = new Queue();
		var temp_stack = new Stack();
		console.log("停车场状态:\n");
		console.log("等待区:");
		var k = 0;

		while(this.wait_zone.size()!=0) {
			//str += ("["+(k++)+"]"+this.wait_zone.peek()+" ");
			console.log(this.wait_zone.peek());
			temp_queue.enqueue(this.wait_zone.peek());
			this.wait_zone.dequeue();
		}
		while(temp_queue.size()!=0) {
			this.wait_zone.enqueue(temp_queue.peek());
			temp_queue.dequeue();
		}


		console.log("停车区:");
		while(!this.park_zone.isEmpty()) {
			temp_stack.push(this.park_zone.peek());
			this.park_zone.pop();
		}
		var k =0;
		while(!temp_stack.isEmpty()) {
			console.log(temp_stack.peek());
			//str += ("["+(k++)+"]"+temp_stack.peek()+" ");
			this.park_zone.push(temp_stack.peek());
			temp_stack.pop();
		}
		console.log("-------------------------------------------------------------");
	}

}


module.exports = function (park_size) { //init park to p and return
  var p = new park(park_size);
	console.log('park initialized...');
	/*
  p.park_car("wxx1");//p.display();
  p.park_car("wxx2");//p.display();
*/
  return p;
}
