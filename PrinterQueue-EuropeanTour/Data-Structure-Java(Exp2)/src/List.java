
public class List<Type>{
	private Node head;
	private Node tail;
	private int size;
	public class Node<Type> {
		private Type data;
		private Node next;
		public Node(Type data) {
			this.data = data;
		}
		public Type getData() {
			return data;
		}
		public String toString() {
			return data+"";
		}
	}
	
	public List() {
		size = 0;
		head = null;
		tail = null;
	}

	public void add(Type data) {
		Node node = new Node(data);
		if(size == 0) {
			size ++;
			head = node;
			tail = node;
			return;
		}
		size ++;
		tail.next = node;
		tail = tail.next;
	}
	
	public int size() {
		return size;
	}
	
	public Type get(int index) {
		Node p = head;
		for(int i=0;i<index;i++) p = p.next;
		return (Type)p.getData();
	}
	
	public void clear() {
		size = 0;
		head = null;
		tail = null;
	}
	
	/**************************debug******
	public static void main(String []args) {
		List list = new List();
		list.add(234);
		list.add(2423424);
		for(int i=0;i<list.size();i++) System.out.println(list.get(i));
	}
	*************************************/
}
