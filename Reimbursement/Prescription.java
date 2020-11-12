
//3.2.3.1
public class Prescription {
	private String kind;
	private String name;
	private String projectId;
	private double price;
	private int quantity;
	private double sum;
	private String time;
	public double getSum() {
		sum = quantity*price;
		return sum;
	}
	
}

