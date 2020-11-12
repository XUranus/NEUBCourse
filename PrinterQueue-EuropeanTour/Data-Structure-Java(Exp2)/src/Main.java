import java.util.*;

public class Main {
	public static void main(String[] args) {
		String start;
		String destination;
		RailSystem sys = new RailSystem();
		sys.LoadServices();
		while (true) {
			System.out.println("Enter a start and destination city: ('quit' to exit)");
			Scanner in = new Scanner(System.in);
			start = in.next();
			destination = "";
			if(start.equals("quit")) {
				System.out.println("exited");
				return;
			}
			else {
				destination = in.next();
			}
			
			sys.setStart(start);
			sys.setDestination(destination);
			sys.Dijkstra();
			sys.CalcuRoute();
			System.out.println("\n");
			sys.Reset();
		}
	}	
}
