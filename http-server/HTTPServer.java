import java.net.*;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;


public class HTTPServer {
	private static int port;
	private static String PATH;
	
	private static boolean loadConfig() {
		try {
			BufferedReader in = new BufferedReader(new FileReader(new File("server.config")));
			String str1 = in.readLine();
			String str2 = in.readLine();
			port = Integer.parseInt(str1.split(" ")[1]);
			PATH = str2.split(" ")[1];
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public static void main(String[] args) {
		if (loadConfig()) {
			System.out.println("HTTP Server Running...\nPort:"+port+"   Document root: "+PATH);
		}
		else {
			System.out.println("Config Load Error! Exit");
		} 
	
		ServerSocket ss=null;
		Socket s=null;      
		try {
			ss=new ServerSocket(port);
			while(true){
				s=ss.accept();
				TaskThread t=new TaskThread(s,PATH);
				t.start();
			}
		} catch (IOException e) {

			e.printStackTrace();
		}finally {
			try {
				ss.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}

