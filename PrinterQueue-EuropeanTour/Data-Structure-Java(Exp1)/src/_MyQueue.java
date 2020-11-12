import java.util.*;

public class _MyQueue<Type> extends SequenceList{
	private int front;
	private int rear;
	private int elementsLength;
	public _MyQueue() {
		super();
		rear = front = 0;
		elementsLength = 10;
	}
	public void dequeue() {
		if(empty()) throw new NoSuchElementException();
		front = (front+1) % elementsLength;
	}
	
	public void inqueue(Type data) {
		if(full()) {
			super.ensureCapacity(2*elementsLength+1);
			elementsLength = 2*elementsLength+1;
		}
		rear = (rear+1) % elementsLength;
		super.set(rear,data);    
	}
	
	public Type head() {
		if(empty()) throw new NoSuchElementException();
		return (Type)super.get((front+1)%elementsLength); 
	}
	
	public boolean empty() {	
		return front==rear;	
	}
	
	public boolean full(){
		return (rear+1) % elementsLength == front;
	}
	
	public int size() {	
		return (rear - front + elementsLength) % elementsLength;	
	}
	
	public void clear() {
		front = rear = 0;
	}
	

	public static void main(String []args) {
		_MyQueue q = new _MyQueue();
		q.inqueue(32);
		q.inqueue(232);
		q.inqueue(45635);
		while(!q.empty()) {
			System.out.println(q.head());
			q.dequeue();
		}
	}

}