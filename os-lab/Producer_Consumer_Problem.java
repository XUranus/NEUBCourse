class Main {
	public static void main(String[] args) {
		Stack s = new Stack(5);
		Consumer s1 = new Consumer(s,1);
		Consumer s2 = new Consumer(s,2);
		Consumer s3 = new Consumer(s,3);
		
		Producer p1 = new Producer(s,1);
		Producer p2 = new Producer(s,2);
		Producer p3 = new Producer(s,3);
		
		s1.start();
		s2.start();
		s3.start();
		p1.start();
		p2.start();
		p3.start();
	}
}

class Item {
	private int id;
	public Item(int id) {
		this.id = id;
	}
	public String toString() {
		return "Item:" + id;
	}
}

class Stack {
	private int capacity;
	private int index;
	private Item [] itemList;
	
	public Stack(int capacity) {
		this.capacity = capacity;
		index = 0;
		itemList = new Item[capacity];
	}
	public synchronized Item push(Item item) {
		while(index==capacity) {
			try{
				this.wait();
			}
			catch(InterruptedException e) {
				e.printStackTrace();
			}
		}
		this.notify();
		itemList[index] = item;
		index++;
		System.out.println("stack pushed one, capacity left "+(capacity-index));
		return item;
	}
	
	public synchronized Item pop(Item item) {
		while(index==0) {
			try{
				this.wait();
			}
			catch(InterruptedException e) {
				e.printStackTrace();
			}
		}
		this.notify();
		itemList[index] = item;
		index--;
		System.out.println("stack poped one, capacity left "+(capacity-index));
		return item;
	}
}

class Producer extends Thread{
	protected Stack s;
	int id;
	
	public Producer(Stack s,int id) {
		this.s = s;
		this.id = id;
	}
	
	public void run() {
		for(int i=1;i<=1000;i++) {
			Item item = new Item(i);
			s.push(item);
			System.out.println("producer "+ id +" produced "+item);
			try {
				Thread.sleep(10);
			}
			catch(InterruptedException e){
				e.printStackTrace();
			}
		}
	}
}


class Consumer extends Thread{
	private Stack s;
	int id;
	
	public Consumer(Stack s,int id) {
		this.s = s;
		this.id = id;
	}
	
	public void run() {
		for(int i=1;i<=1000;i++) {
			Item item = new Item(i);
			s.pop(item);
			System.out.println("consumer "+id+" consumed "+item);
			try {
				Thread.sleep(10);
			}
			catch(InterruptedException e){
				e.printStackTrace();
			}
		}
	}
}