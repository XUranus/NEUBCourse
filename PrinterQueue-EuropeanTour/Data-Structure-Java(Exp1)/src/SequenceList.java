public class SequenceList<Type> {
	private static final int DEFAULT_CAPACITY = 10;
	private static int CAPACITY = 10;
	private Type[] elements;
	private int size;
	
	public Object getArray() {
		return elements;
	}
	
	public SequenceList() {
		elements = (Type[])new Object[DEFAULT_CAPACITY];
		size = 0;
	}
	
	public SequenceList(int size) {
		elements = (Type[])new Object[size];
		this.size = 0;
	}
	
	public void clear() {
		size = 0;
	}
	
	public boolean isEmpty() {
		return size==0;
	}
	
	public int size() {
		return size;
	}
	
	public Type get(int index) {
	//	if(index<0 || index>=size) throw new ArrayIndexOutOfBoundsException();
		return elements[index];
	}
	
	public Type set(int index,Type data) {
	//	if(index<0 || index>=size) throw  new ArrayIndexOutOfBoundsException();
		Type old = elements[index];
		elements[index] = data;
		return old;
	}
	
	public void ensureCapacity(int newSize) {
		if(newSize<size) return ;
		Type[] old = elements;
		elements =(Type[])new Object[newSize];
		for(int i=0;i<size;i++) 
		elements[i] = old[i];
		CAPACITY = newSize;
	}
	
	public void trimToSize() {
		ensureCapacity(size);
	}
	
	public Type push_back(Type data) {
		if(size==CAPACITY-1) ensureCapacity(2*CAPACITY+1);
		elements[size] = data;
		size++;
		return data;
	}
	
	public Type insert(int index,Type data) { //在index处插入 
		if(index<0 || index>=size) throw  new ArrayIndexOutOfBoundsException();
		if(size==CAPACITY-1) ensureCapacity(2*CAPACITY+1);
		for(int i=size;i>index;i--) elements[i]=elements[i-1];
		elements[index] = data;
		size++;
		return data;
	}
	
	public int find(Object data) { //线型查找
		if(data==null) 
		for(int i=0;i<size;i++) if(elements[i]==null) return i;
		else 
			for(i=0;i<size;i++) 
				if(data.equals(elements[i])) return i;
		return -1;
	}
	
	public Type remove(int index) {
		if(index<0 || index>=size) throw  new ArrayIndexOutOfBoundsException();
		Object old = elements[index];
		for (int i=index;i<=size;i++) {
			elements[i] = elements[i+1];
		}
		size--;
		return (Type)old;
	} 
	
	public int setSize(int n){
		size = n;
		return size;
	}
	
	
	/*************************************************
	public static void main(String[] args) {
		SequenceList list = new SequenceList();
		list.push_back(1312);
		list.push_back(64);
		list.push_back(345);
		for(int i=0;i<list.size();i++) System.out.println(list.get(i)+" ");
		
		list.remove(1);
		for(int i=0;i<list.size();i++) System.out.println(list.get(i)+" ");
	}
	*******************************/
}