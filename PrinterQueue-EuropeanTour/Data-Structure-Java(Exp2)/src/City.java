public class City { //nod
	private static int INF = 9999999;
	public  City lastCity;
	public  City nextCity;
	private String name;
	private int distance;
	private int fee;
	private boolean visited;
	private List<Service> services; //edges
	public int DistanceTo(String name) {
		if(name == this.name) return 0;
		for(int i=0;i<services.size();i++) {
			if(services.get(i).getDestinationName().equals(name)) 
			return services.get(i).getDistance();
		}
		return INF;
	}
	public int FeeTo(String name) {
		if(name == this.name) return 0;
		for(int i=0;i<services.size();i++) {
			if(services.get(i).getDestinationName().equals(name)) 
			return services.get(i).getFee();
		}
		return INF;
	}
	public List<Service> getServiceList() {
		return services;
	}
	public void setDistance(int distance) {
		this.distance = distance;
	}
	
	public int getDistance() {
		return distance;
	}
	public int getFee() {
		return fee;
	}
	public void setFee(int fee) {
		this.fee = fee;
	}
	public void setVisit(boolean v) {
		visited = v;
	}
	
	public boolean Visited() {
		return visited;
	}
	
	public City(String name) {
		this.name = name;
		services = new List();
		visited = false;
		distance = INF;
		fee = INF;
	}
	
	public String getName() {
		return name;
	}
	
	public void addService(Service service) {
		services.add(service);
	}
	
	public String toString() {
		String str = name+ " dis:"+getDistance();
		return str;
	}
}
