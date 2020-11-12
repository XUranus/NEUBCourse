import java.util.*;
import java.io.*;

public class RailSystem {
	private static int INF = 9999999;
	private String start,destination;
	private static int totalDistance = 0;
	Map<String,City> map;
	List<City> cities;
	private String route = "";
	public RailSystem() {
		cities = new List();
	}
	
	public void setStart(String start) {
		this.start = start;
	} 
	
	public void setDestination(String destination) {
		this.destination = destination;
	}
	
	public City getCityByName(String name) {
		/*for(int i=0;i<cities.size();i++) {
			if(cities.get(i).getName().equals(name)) 
				return cities.get(i);
		}
		return null;*/
		return map.get(name);
	}
	
	public void LoadServices() {
		//Lisbon Madrid 75 450
		String filename = "services.txt";
		File f;
		String str;
		BufferedReader in;
		try {
			f = new File(filename);
			in = new BufferedReader(new FileReader(f));
			while ((str = in.readLine())!=null) {
				StringTokenizer st = new StringTokenizer(str, " ");
				String name = st.nextToken();
				String destinationName = st.nextToken();
				int fee = Integer.parseInt(st.nextToken());
				int distance = Integer.parseInt(st.nextToken());
				Service service = new Service(destinationName,fee,distance);
				boolean flag = false;
				for(int i=0;i<cities.size();i++) {
					if(cities.get(i).getName().equals(name)) {
						cities.get(i).addService(service);
						flag = true;
					}
				}
				if(!flag) {
					City city = new City(name);
					city.addService(service);
					cities.add(city);
				}
				
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
		map = new HashMap<String,City>();
		for(int i=0;i<cities.size();i++) {
			map.put(cities.get(i).getName(),cities.get(i));
		}
		/*debug
		for(int i=0;i<cities.size();i++) {
			System.out.println(cities.get(i));
		}*/
	}
	
	public void Reset() {
		for(int i=0;i<cities.size();i++) {
			cities.get(i).setFee(INF);
			cities.get(i).setVisit(false);
		}
	}
	/*
	String RecoverRoute(String cityName) {
		return 
	}*/
	
	public boolean Check() {
		if(getCityByName(start)==null || getCityByName(destination)==null) 
		return false;
		else return true; 
	}
	
	public void Dijkstra() {
		if(!Check()) {
			System.out.println("City not found");
			return;
		}
		int visitNum = 0;
		int totalNum = cities.size();
		City v0 = getCityByName(start);
		for(int i=0;i<cities.size();i++) {
			cities.get(i).setFee(v0.FeeTo(cities.get(i).getName()));
			cities.get(i).lastCity = v0;
		}
		v0.setVisit(true);visitNum++;
		v0.setFee(0);

		while (visitNum!=totalNum) {
			int minDis = INF ;
			int k = 0;
			for(int i=0;i<cities.size();i++) {
				if(!cities.get(i).Visited()) {
					if(cities.get(i).getFee() < minDis) {
						minDis = cities.get(i).getFee();
						k = i;
					}
				}
			}
			cities.get(k).setVisit(true);visitNum++;

			City cityK = cities.get(k);
			for(int i=0;i<cities.size();i++) {
				if(!cities.get(i).Visited()) {
					if ( cities.get(i).getFee() > (cityK.FeeTo(cities.get(i).getName())+cityK.getFee())  ) {
						cities.get(i).setFee(cityK.FeeTo(cities.get(i).getName())+cityK.getFee());
						cities.get(i).lastCity = cityK;
						cityK.nextCity = cities.get(i);
					}
				}
			}
		}
		if(getCityByName(destination).getFee() == INF) {
			System.out.println("No way to reach");
			return ;
		}
	}
	
	public void CalcuRoute() {
		Stack<String> s = new Stack();
		String cityname = destination;
		while (true) {
			s.push(cityname);
			totalDistance+=getCityByName(cityname).lastCity.DistanceTo(cityname);
			if (getCityByName(cityname).lastCity.getName().equals(start)) {
				break;
			};
			cityname = getCityByName(cityname).lastCity.getName();
		}
		route+=start;
		while (!s.empty()) {
			route+=" to "+s.pop();
		}
		System.out.println("The cheapest route from "+start+" to "+destination+"\n"+"costs "+getCityByName(destination).getFee()+" euros and spans "+totalDistance+" kilometers");
		System.out.println(route);

	}
	
}
