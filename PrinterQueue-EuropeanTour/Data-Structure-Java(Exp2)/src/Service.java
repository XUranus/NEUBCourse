import javax.print.attribute.standard.*;

public class Service { //edge
	String destinationName;
	int fee;
	int distance;
	public Service(String name,int fee,int distance) {
		destinationName = name;
		this.fee = fee;
		this.distance = distance;
	}
	public String toString(){
		return destinationName;
	}
	
	public String getDestinationName() {
		return destinationName;
	}
	
	public int getFee() {
		return fee;
	}
	
	public int getDistance() {
		return distance;
	}
}
