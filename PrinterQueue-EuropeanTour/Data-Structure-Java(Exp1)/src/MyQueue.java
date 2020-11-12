
public class MyQueue<Type> extends LinkedList{
	public void dequeue() {
		remove(0);
	}
	
	public void inqueue(Type data) {
		add(data);
	}
	
	public Type head() {
		return (Type)super.get(0).getData();
	}
	
	public boolean empty() {
		return size()==0;
	}
	
	
	/*************************************************
	public static void main(String []args) {
		MyQueue q = new MyQueue();
		q.inqueue(32);
		q.inqueue(232);
		q.inqueue(45635);
		while(!q.empty()) {
			System.out.println(q.head());
			q.dequeue();
		}
	}
	***************************************************/
}
