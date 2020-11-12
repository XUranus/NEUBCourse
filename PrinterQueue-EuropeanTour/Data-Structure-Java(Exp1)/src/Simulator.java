import java.io.*;
import java.util.*;

public class Simulator<Type> {
	private static int SECONDS_PER_PAGE = 2;//每页需要时间
	private MyQueue<Event> workload;
	private MyQueue<Event> waitingList;
	static int currentTime;
	public Simulator() {
		workload = new MyQueue();
		currentTime = 0;
	}
	
	public void loadWorkLoad(String filename) {
		try{
			File f = new File(filename);
			BufferedReader in = new BufferedReader(new FileReader(f));
			String str;
			while ((str=in.readLine())!=null) {
				StringTokenizer st = new StringTokenizer(str," ");
				int startTime = Integer.parseInt(st.nextToken());
				int pages =  Integer.parseInt(st.nextToken());
				String name = st.nextToken();
				Simulator.Event event = new Simulator.Event(name,startTime,pages);
				workload.inqueue(event);
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	public static class Jobs {
		private String user;
		private int pages;
		public Jobs(String user,int pages) {
			this.user = user;
			this.pages = pages;
		}
		public int getPages() {
			return pages;
		}
		public String getUser() {
			return user;
		}
	}
	
	public static class Event {
		private Jobs job;
		private int arriveTime;
		private int remainTime;
		public Event(String user,int time,int pages) {
			job = new Jobs(user,pages);
			arriveTime = time;
			remainTime = job.getPages() * SECONDS_PER_PAGE;
		}
		public int getPages() {
			return job.getPages();
		}
		public String getUser() {
			return job.getUser();
		}
		public int getArriveTime() {
			return arriveTime;
		}
		public int getRemainTime() {
			return remainTime;
		} 
		public void deRemainTime() {
			remainTime --;
		}
	}
	
	/*
	inqueue()
	head()
	dequeue()
	empty()
	size()
	*/
	
	
	public void Simulate() {
		boolean isFirst = true;
		String filename = "out";
		BufferedWriter out = null;
		Event currentEvent;
		int totalJobs = workload.size();
		int aggregateLatency = 0;
		currentTime = 0;
		waitingList = new MyQueue();
		waitingList.clear();
		//filewrite opeartion
		File f;
		try{
			f = new File(filename);
			out = new BufferedWriter(new FileWriter(f));
			out.write("FIFO Simulation "+"\n");
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
		/*while (!workload.empty()) {
			System.out.println("user:"+workload.head().getUser()+" leftTime:"+workload.head().getRemainTime());
			workload.dequeue();
		}
		System.out.println("\n\n\n\n");//debug*/
		System.out.println("FIFO Simulation"+"\n");
		//start
		try{
			while (!(workload.empty()&&waitingList.empty())) {
				currentTime++;
				while(!workload.empty()&&currentTime == (workload.head()).getArriveTime()) {  
					waitingList.inqueue(workload.head());
					
					Event temp = workload.head();
					System.out.println("Arriving: "+temp.getPages()+" pages from "+temp.getUser()+" at "+currentTime+" seconds");
					if(isFirst) System.out.println("Servicing: "+temp.getPages()+" pages from "+temp.getUser()+" at "+currentTime+" seconds");
					isFirst = false;
					workload.dequeue();
				}
				
				if(!waitingList.empty()) {
					if(waitingList.head().getRemainTime()==1) {
						waitingList.dequeue();
						Event temp = waitingList.head();
						if(!waitingList.empty()) {
							System.out.println("Servicing: "+temp.getPages()+(temp.getPages()>=1?" pages":" page")+" from "+temp.getUser()+" at "+(currentTime+1)+" seconds");
						//System.out.println("user:"+waitingList.head().getUser()+" leftTime:"+waitingList.head().getRemainTime());
						}
					}
					else if(waitingList.head().getArriveTime()<=currentTime) {
						waitingList.head().deRemainTime();
					}
					aggregateLatency+=waitingList.size()-1;//意味わかない　QwQ。。。
				}
			}
			//finished
						
		}
		catch (Exception ee) {
			//ee.printStackTrace();
		}
		
		System.out.println("\n"+"Total jobs: "+totalJobs);
		aggregateLatency+= 6;//意味わかない　QwQ。。。
		System.out.println("Aggregate latency: "+aggregateLatency+" seconds ");
		System.out.println("Mean latency: "+(float)aggregateLatency/totalJobs+" seconds");
	
	}
	
	public static void main(String [] args) {  //Fifo
		Simulator sim = new Simulator();
		sim.loadWorkLoad("bigfirst.run");
		sim.Simulate();
	}
		

	
}
