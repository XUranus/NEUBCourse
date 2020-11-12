import java.util.*;

public class LinkedList<Type> {
	public static class Node<Type>{
		private Type data;
		private Node<Type> next;
		private Node<Type> pre;
		public Node(Type data) {
			this.data = data;
		}
		public Type getNode() {
			return data;
		}
		public Type getData() {
			return data;
		}
	}
	int size;
	Node<Type> tail;
	Node<Type> head;
	public int size() {
		return size;
	}
	
	public LinkedList() {
		tail = null;
		head = null;
		size = 0;
	}
	
	
	public Node<Type> add(Type dat) {
		Node<Type> data = new Node<Type>(dat);
		if(size==0) {
			head = data;
			tail = data;
			size++;
		}
		else {
			tail.next = data;
			tail.next.pre = tail;
			tail = data;
			size++;
		}
		return data;
	}
	
	
	public Node<Type> get(int index) {
		if(index==0) return head;
		if (index>=size) return null;
		int count = 0;
		Node<Type> p = head;
		for(int i=0;i<index;i++) p = p.next;
		return p;
	}
	
	public Node<Type> set(int index,Node<Type> node) {
		Node<Type> p = head;
		for(int i=0;i<index;i++) p = p.next;
		p = node;
		return node;
	} 
	
	public Node<Type> insertAsPrefix(int index,Node<Type> node) {
		if(index>=size || index<0) {System.out.println("Index excceed exception");return null;}
		Node p = get(index);
		p.pre.next = node;
		node.pre = p.pre;
		node.next = p;
		p.pre = node;
		size++;
		return node;
	}
	
	public Node<Type> insertAsSuffix(int index,Node<Type> node) {
		if(index>size || index<0) {System.out.println("Index excceed exception");return null;}
		Node p = get(index);
		p.pre.next = node;
		node.pre = p;
		node.next = p.next;
		p.next = node;
		node.next.pre = node;
		size++;
		return node;
	}
	
	public Node<Type> insert(int index,Node<Type> data) {
		return insertAsSuffix(index,data);
	}
	
	public void remove(int index) {
		if(index==0) {
			head = head.next;
			size--;
			return;
		}
		Node<Type> p = get(index);
		p.pre.next = p.next;
		p.next.pre = p.pre;
		size--;
		p = null;
	}
	
	public static LinkedList merge(LinkedList a,LinkedList b) { //返回a,b合并后的表头
		a.tail = b.head;
		b.head = a.tail;
		return a;
	}
	
	public Node<Type> find(Node<Type> node) {
		Node<Type> p = head;
		while (p!=null) {
			if(p.equals(node)) return p;
			p=p.next;
		}
		return null;
	}
	
	
	public void clear() {
		tail = null;
		head = null;
		size = 0;
	}
	
	public class ListIterator {
		private LinkedList list;
		private Node current;
		public ListIterator() {
			current = head;
		}
		
		public boolean hasNext(){
			if(current!=null) return true;
			else return false;
		}

		public Node next() {
			if(!hasNext()) throw new java.util.NoSuchElementException();
			Node p = current;
			current = current.next;
			return p;
		}
	}
	/**************************************************
	public static void main(String[] args) {
		LinkedList list = new LinkedList();
		list.add(1);
		list.add(234);
		list.add(32);
		list.add(323);
		for(int i=0;i<list.size();i++) System.out.print(list.get(i)+" ");
		System.out.print("\n");
		
		list.bubbleSort();
		for(int i=0;i<list.size();i++) System.out.print(list.get(i)+" ");
		
		System.out.print("\n");
		LinkedList.ListIterator it = list.new ListIterator();
		while (it.hasNext()) {
			System.out.println(it.next());
		}
	} 
	**************************************************/
}

